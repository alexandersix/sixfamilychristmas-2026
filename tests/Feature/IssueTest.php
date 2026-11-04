<?php

use App\Filament\Resources\Events\Pages\CreateEvent;
use App\Filament\Resources\Events\Pages\EditEvent;
use App\Filament\Resources\Issues\Pages\CreateIssue;
use App\Filament\Resources\Issues\Pages\EditIssue;
use App\Filament\Resources\Issues\RelationManagers\EventsRelationManager;
use App\Models\Event;
use App\Models\Issue;
use App\Models\User;
use Database\Seeders\IssueSeeder;
use Filament\Actions\Testing\TestAction;
use Filament\Facades\Filament;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

beforeEach(function () {
    Storage::fake('s3', ['visibility' => config('filesystems.disks.s3.visibility')])->buildTemporaryUrlsUsing(
        fn (string $path, DateTimeInterface $expiration): string => 'https://photos.example.test/'.$path.'?expires='.$expiration->getTimestamp(),
    );
    Filament::setCurrentPanel(Filament::getPanel('admin'));
});

test('editors create issues with unique permanent addresses and publish them', function () {
    $this->actingAs(User::factory()->create());

    Livewire::test(CreateIssue::class)
        ->fillForm(['name' => 'Christmas 2026'])
        ->call('create')
        ->assertHasNoFormErrors();

    $issue = Issue::sole();
    expect($issue->slug)->toBe('christmas-2026')
        ->and($issue->is_published)->toBeFalse();

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['name' => 'Our year', 'is_published' => true])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($issue->fresh()->slug)->toBe('christmas-2026');
    $this->get('/issues/christmas-2026')->assertOk();

    $duplicate = Issue::factory()->create(['name' => 'Christmas 2026']);
    expect($duplicate->slug)->toBe('christmas-2026-2');
});

test('editors upload photos and create an event directly inside an issue', function () {
    $this->actingAs(User::factory()->create());
    $issue = Issue::factory()->create();

    Livewire::test(EventsRelationManager::class, [
        'ownerRecord' => $issue,
        'pageClass' => EditIssue::class,
    ])
        ->callAction(TestAction::make('create')->table(), data: [
            'name' => 'Beach week',
            'title' => 'Sandy feet. Full hearts.',
            'body' => '<p>A week together by the water.</p>',
            'photos' => [
                ['path' => [UploadedFile::fake()->image('beach.jpg')], 'alt' => 'Walking on the beach', 'caption' => 'Our favorite evening'],
                ['path' => [UploadedFile::fake()->image('shells.png')], 'alt' => 'Shells in the sand', 'caption' => 'Treasures'],
            ],
        ])
        ->assertHasNoFormErrors();

    $event = $issue->events()->sole();
    expect($event->name)->toBe('Beach week')
        ->and(array_column($event->photos, 'alt'))->toBe(['Walking on the beach', 'Shells in the sand']);
    foreach ($event->photos as $photo) {
        Storage::disk('s3')->assertExists($photo['path']);
        expect(Storage::disk('s3')->getVisibility($photo['path']))->toBe('private');
    }

    Livewire::test(EditEvent::class, ['record' => $event->id])
        ->fillForm(['title' => 'A new headline'])
        ->call('save')
        ->assertHasNoFormErrors();
    expect($event->fresh()->title)->toBe('A new headline')
        ->and($event->fresh()->photos)->toBe($event->photos);

    Livewire::test(EditEvent::class, ['record' => $event->id])
        ->fillForm(['photos' => array_map(fn (array $photo) => [...$photo, 'path' => [$photo['path']]], array_reverse($event->photos))])
        ->call('save')
        ->assertHasNoFormErrors();
    expect(array_column($event->fresh()->photos, 'alt'))->toBe(['Shells in the sand', 'Walking on the beach']);
});

test('editors reuse reorder and remove events without changing another issue', function () {
    $this->actingAs(User::factory()->create());
    $issue = Issue::factory()->create();
    $other = Issue::factory()->create();
    [$first, $second, $third] = Event::factory()->count(3)->create()->all();
    $issue->events()->attach([$first->id, $second->id]);
    $other->events()->attach([$second->id, $first->id]);

    $editor = Livewire::test(EventsRelationManager::class, [
        'ownerRecord' => $issue,
        'pageClass' => EditIssue::class,
    ]);
    $editor->callAction(TestAction::make('attach')->table(), data: ['recordId' => $third->id])
        ->assertHasNoFormErrors();
    expect($issue->events()->pluck('events.id')->all())->toBe([$first->id, $second->id, $third->id]);

    $editor->call('reorderTable', [$third->id, $first->id, $second->id]);
    expect($issue->events()->pluck('events.id')->all())->toBe([$third->id, $first->id, $second->id])
        ->and($other->events()->pluck('events.id')->all())->toBe([$second->id, $first->id]);

    $editor->callAction(TestAction::make('detach')->table($first));
    expect($issue->events()->pluck('events.id')->all())->toBe([$third->id, $second->id])
        ->and($other->events()->pluck('events.id')->all())->toBe([$second->id, $first->id])
        ->and(Event::count())->toBe(3);

    expect(Gate::allows('delete', $first))->toBeFalse();
    $other->delete();
    expect(Gate::allows('delete', $first))->toBeTrue()
        ->and(Event::count())->toBe(3);
});

test('issue pages hide drafts and return ordered sanitized stories with expiring photos', function () {
    $draft = Issue::factory()->create(['name' => '2026']);
    $this->get('/issues/2026')->assertNotFound();
    $this->get('/issues/2026?preview=1')->assertNotFound();
    $this->get('/issues/missing')->assertNotFound();
    $this->get('/issues/2026/preview')->assertRedirect('/admin/login');

    $this->actingAs(User::factory()->create())
        ->get('/issues/2026/preview')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('preview', true)->has('issue.events', 0));
    $this->get('/issues/2026')->assertNotFound();

    $first = Event::factory()->create(['body' => '<p>A <strong>real</strong> story.</p><script>alert(1)</script>']);
    $second = Event::factory()->create();
    $draft->events()->attach($first, ['position' => 5]);
    $draft->events()->attach($second, ['position' => 2]);
    $draft->update(['is_published' => true]);
    auth()->logout();

    $this->get('/issues/2026')
        ->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertInertia(fn (Assert $page) => $page
            ->component('issues/show')
            ->where('preview', false)
            ->has('issue.events', 2)
            ->where('issue.events.0.id', $second->id)
            ->where('issue.events.1.id', $first->id)
            ->where('issue.events.1.body', fn (string $body) => str_contains($body, '<strong>real</strong>') && ! str_contains($body, '<script'))
            ->where('issue.events.1.photos.0.alt', 'A family memory')
            ->where('issue.events.1.photos.0.src', fn (string $url) => str_starts_with($url, 'https://photos.example.test/events/') && str_contains($url, '?expires='))
            ->missing('issue.events.1.photos.0.path'));
});

test('event photo counts match the supported compositions', function (int $count) {
    $photo = ['path' => 'events/example.webp', 'alt' => 'A memory'];
    if ($count === 0 || $count === 5) {
        expect(fn () => Event::factory()->create(['photos' => array_fill(0, $count, $photo)]))
            ->toThrow(ValidationException::class);
    } else {
        $event = Event::factory()->create(['photos' => array_fill(0, $count, $photo)]);
        expect($event->fresh()->photos)->toHaveCount($count);
    }
})->with([0, 1, 2, 3, 4, 5]);

test('the event form rejects missing photos descriptions and non-image uploads', function () {
    $this->actingAs(User::factory()->create());
    $form = Livewire::test(CreateEvent::class);
    $form->fillForm(['name' => 'Test', 'title' => 'Headline', 'body' => '<p>Story</p>', 'photos' => []])
        ->call('create')->assertHasFormErrors(['photos']);
    $form->fillForm(['photos' => [['path' => [UploadedFile::fake()->create('document.pdf', 5, 'application/pdf')], 'alt' => '']]])
        ->call('create')->assertHasFormErrors(['photos.0.path', 'photos.0.alt']);
    expect(Event::count())->toBe(0);
});

test('editors cannot substitute a photo path belonging to another event', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create();
    Storage::disk('s3')->put($event->photos[0]['path'], 'original');
    Storage::disk('s3')->put('events/someone-else.jpg', 'other photo');

    Livewire::test(EditEvent::class, ['record' => $event->id])
        ->fillForm(['photos' => [['path' => ['events/someone-else.jpg'], 'alt' => 'Substituted']]])
        ->call('save')
        ->assertHasFormErrors(['photos.0.path']);

    expect($event->fresh()->photos[0]['alt'])->toBe('A family memory');
});

test('sample issue seeding is repeatable and preserves editorial changes', function () {
    $this->seed(IssueSeeder::class);
    $issue = Issue::sole();
    expect($issue->slug)->toBe('2026')->and($issue->is_published)->toBeFalse()
        ->and($issue->events->map(fn (Event $event) => count($event->photos))->all())->toBe([1, 2, 3, 4]);
    $event = $issue->events->first();
    $event->update(['title' => 'Our own headline']);
    $this->seed(IssueSeeder::class);
    expect(Issue::count())->toBe(1)->and(Event::count())->toBe(4)
        ->and($event->fresh()->title)->toBe('Our own headline');
});
