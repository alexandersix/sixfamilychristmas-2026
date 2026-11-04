<?php

use App\Models\Event;
use App\Models\Issue;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Testing\AssertableInertia as Assert;

test('guests receive only a login page and cannot fetch issue content or photographs', function () {
    $issue = Issue::factory()->published()->create([
        'password' => 'invitation-password',
        'cover_photo_path' => 'issues/private-cover.jpg',
        'cover_headline' => 'Private headline',
        'last_word_body' => '<p>Private letter</p>',
    ]);
    $event = Event::factory()->create(['body' => '<p>Private story</p>']);
    $issue->events()->attach($event);
    $base = '/issues/'.$issue->slug;

    foreach ([$base, $base.'/cover', $base.'/events/'.$event->id.'/photos/0'] as $url) {
        $this->get($url)->assertRedirect($base.'/login')
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertDontSee('Private story')->assertDontSee('Private headline');
    }
    $this->get($base, [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => Inertia::getVersion(),
        'X-Inertia-Partial-Data' => 'issue',
    ])
        ->assertRedirect($base.'/login');
    $this->getJson($base)->assertRedirect($base.'/login');
    $this->get($base.'/login')->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertInertia(fn (Assert $page) => $page->component('issues/login')
            ->missing('issue')->where('loginUrl', url($base.'/login')))
        ->assertDontSee($issue->password)->assertDontSee('private-cover.jpg')
        ->assertDontSee('Private letter')->assertDontSee('Private story');
});

test('password authorization is per issue and never grants admin or draft access', function () {
    $issue = Issue::factory()->published()->create(['password' => 'shared-password']);
    $other = Issue::factory()->published()->create(['password' => 'shared-password']);
    $draft = Issue::factory()->create(['password' => 'shared-password']);

    $this->post('/issues/'.$issue->slug.'/login', ['password' => 'shared-password'])
        ->assertRedirect('/issues/'.$issue->slug);
    $this->get('/issues/'.$issue->slug)->assertOk();
    $this->get('/issues/'.$other->slug)->assertRedirect('/issues/'.$other->slug.'/login');
    $this->get('/issues/'.$issue->slug.'/preview')->assertRedirect('/admin/login');
    $this->get('/admin')->assertRedirect('/admin/login');
    $this->post('/issues/'.$draft->slug.'/login', ['password' => 'shared-password'])->assertNotFound();
    $this->get('/issues/'.$draft->slug.'/login')->assertNotFound();
    $this->get('/issues/'.$draft->slug)->assertNotFound();
});

test('invalid passwords are not remembered and repeated guesses are throttled', function () {
    $this->freezeTime();
    $issue = Issue::factory()->published()->create(['password' => 'correct-password']);
    $url = '/issues/'.$issue->slug.'/login';

    foreach (range(1, 5) as $attempt) {
        $this->from($url)->post($url, ['password' => 'wrong-password'])
            ->assertRedirect($url)->assertSessionHasErrors('password');
    }
    expect(session()->getOldInput('password'))->toBeNull();
    $this->get('/issues/'.$issue->slug)->assertRedirect($url);
    $this->post($url, ['password' => 'correct-password'])->assertSessionHasErrors([
        'password' => 'Too many attempts. Please try again in 60 seconds.',
    ]);
    $this->travel(61)->seconds();
    $this->post($url, ['password' => 'correct-password'])->assertSessionHasNoErrors();
    $this->get('/issues/'.$issue->slug)->assertOk();
});

test('authorization expires exactly 24 hours after login even with continued use', function () {
    $issue = Issue::factory()->published()->create(['password' => 'invitation-password']);
    $base = '/issues/'.$issue->slug;
    $this->post($base.'/login', ['password' => 'invitation-password'])->assertSessionHasNoErrors();
    $this->travel(24 * 60 * 60 - 1)->seconds();
    $this->get($base)->assertOk();
    $this->travel(1)->seconds();
    $this->get($base)->assertRedirect($base.'/login');
});

test('changing or removing the password and unpublishing revoke existing access', function (string $change) {
    $issue = Issue::factory()->published()->create(['password' => 'invitation-password']);
    $base = '/issues/'.$issue->slug;
    $this->post($base.'/login', ['password' => 'invitation-password']);
    $this->get($base)->assertOk();

    if ($change === 'replace') {
        $issue->update(['password' => 'replacement-password']);
        $this->get($base)->assertRedirect($base.'/login');
        $this->post($base.'/login', ['password' => 'invitation-password'])->assertSessionHasErrors('password');
        $this->post($base.'/login', ['password' => 'replacement-password'])->assertSessionHasNoErrors();
        $this->get($base)->assertOk();
    } elseif ($change === 'remove') {
        $issue->update(['password' => null]);
        $this->get($base)->assertForbidden();
        $this->get($base.'/login')->assertForbidden();
        $this->post($base.'/login', ['password' => 'invitation-password'])->assertForbidden();
    } else {
        $issue->update(['is_published' => false]);
        $this->get($base)->assertNotFound();
    }
})->with(['replace', 'remove', 'unpublish']);

test('private photographs require current authorization and belong to the requested issue', function () {
    Storage::fake('s3');
    $issue = Issue::factory()->published()->create([
        'password' => 'invitation-password', 'cover_photo_path' => 'issues/cover.jpg',
    ]);
    $event = Event::factory()->create(['photos' => [
        ['path' => 'events/first.jpg', 'alt' => 'First'],
        ['path' => 'events/second.jpg', 'alt' => 'Second'],
    ]]);
    $unrelated = Event::factory()->create();
    $issue->events()->attach($event);
    Storage::disk('s3')->put('issues/cover.jpg', 'cover bytes');
    Storage::disk('s3')->put('events/first.jpg', 'first photo bytes');
    Storage::disk('s3')->put('events/second.jpg', 'second photo bytes');
    $base = '/issues/'.$issue->slug;
    $photo = $base.'/events/'.$event->id.'/photos/1';

    $this->post($base.'/login', ['password' => 'invitation-password']);
    $this->get($base.'/cover')->assertOk()->assertStreamedContent('cover bytes')
        ->assertHeader('Cache-Control', 'no-store, private');
    $this->get($photo)->assertOk()->assertStreamedContent('second photo bytes')
        ->assertHeader('Cache-Control', 'no-store, private');
    $this->get($base.'/events/'.$event->id.'/photos/2')->assertNotFound();
    $this->get($base.'/events/'.$unrelated->id.'/photos/0')->assertNotFound();
    $this->travel(24)->hours();
    $this->get($photo)->assertRedirect($base.'/login');
    $this->get($base.'/cover')->assertRedirect($base.'/login');
});

test('admin sessions cannot bypass the reader gate but can preview passwordless drafts', function () {
    $issue = Issue::factory()->published()->create();
    $this->actingAs(User::factory()->create());
    $this->get('/issues/'.$issue->slug)->assertForbidden();
    $issue->update(['is_published' => false]);
    $this->get('/issues/'.$issue->slug.'/preview')->assertOk();
});
