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
use Illuminate\Support\Facades\Hash;
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

test('issue passwords use Laravel hashing and are hidden from serialization', function () {
    $issue = Issue::factory()->create(['password' => 'winter-family-2026']);
    $stored = $issue->fresh()->getRawOriginal('password');

    expect($stored)->not->toBe('winter-family-2026')
        ->and(Hash::check('winter-family-2026', $stored))->toBeTrue()
        ->and(Hash::check('incorrect-password', $stored))->toBeFalse()
        ->and($issue->toArray())->not->toHaveKey('password')
        ->and($issue->toJson())->not->toContain($stored);
});

test('editors set replace and preserve issue passwords without receiving the hash', function () {
    $this->actingAs(User::factory()->create());

    Livewire::test(CreateIssue::class)
        ->fillForm(['name' => '2026', 'password' => 'first-family-password'])
        ->call('create')
        ->assertHasNoFormErrors()
        ->assertSet('data.password', null);

    $issue = Issue::sole();
    $originalHash = $issue->password;
    expect(Hash::check('first-family-password', $originalHash))->toBeTrue();

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->assertSet('data.password', null)
        ->assertDontSee($originalHash)
        ->fillForm(['name' => 'Renamed issue', 'password' => ''])
        ->call('save')
        ->assertHasNoFormErrors();
    expect($issue->fresh()->password)->toBe($originalHash);

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['password' => 'replacement-family-password'])
        ->call('save')
        ->assertHasNoFormErrors()
        ->assertSet('data.password', null);

    $newHash = $issue->fresh()->password;
    expect(Hash::check('replacement-family-password', $newHash))->toBeTrue()
        ->and(Hash::check('first-family-password', $newHash))->toBeFalse();
});

test('issue passwords follow the account policy and bcrypt byte maximum', function (string $password, bool $valid, string $environment = 'testing') {
    app()->instance('env', $environment);
    $this->actingAs(User::factory()->create());
    $form = Livewire::test(CreateIssue::class)
        ->set('data.name', '2026')
        ->set('data.password', $password)
        ->call('create');

    if ($valid) {
        $form->assertHasNoFormErrors();
        expect(Hash::check($password, Issue::sole()->password))->toBeTrue();
    } else {
        $form->assertHasFormErrors(['password']);
        expect(Issue::count())->toBe(0);
    }
})->with([
    'too short' => ['1234567', false],
    'minimum length' => ['12345678', true],
    '72 bytes' => [str_repeat('é', 36), true],
    '73 bytes' => [str_repeat('a', 73), false],
    'multibyte overflow' => [str_repeat('é', 37), false],
    'production policy' => ['12345678', false, 'production'],
]);

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
    $draft = Issue::factory()->create(['name' => '2026', 'password' => 'family-preview-password']);
    $this->get('/issues/2026')->assertNotFound();
    $this->get('/issues/2026?preview=1')->assertNotFound();
    $this->get('/issues/missing')->assertNotFound();
    $this->get('/issues/2026/preview')->assertRedirect('/admin/login');

    $this->actingAs(User::factory()->create())
        ->get('/issues/2026/preview')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('preview', true)->has('issue.events', 0)->missing('issue.password')
            ->where('issue.publication_name', 'The Six Family')
            ->where('issue.cover_headline', "A year to\nhold on to")
            ->where('issue.cover_introduction', 'The moments, big and small, that made our 2026.')
            ->where('issue.last_word', null)
            ->where('issue.cover_photo', null));
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
            ->missing('issue.password')
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

test('sample issue seeding adds complete issues without changing existing data', function () {
    $this->seed(IssueSeeder::class);
    $issue = Issue::sole();
    expect($issue->slug)->toBe('2026')->and($issue->is_published)->toBeFalse()
        ->and($issue->password)->not->toBe('password')
        ->and(Hash::check('password', $issue->password))->toBeTrue()
        ->and($issue->show_last_word)->toBeTrue()
        ->and($issue->last_word_title)->toBe("A note from\nthe family")
        ->and($issue->last_word_body)->toContain('What a gift to look back on another year together.', 'Wishing you a peaceful Christmas and a new year full of good things.')
        ->and($issue->events->map(fn (Event $event) => count($event->photos))->all())->toBe([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
    $event = $issue->events->first();
    $event->update(['title' => 'Our own headline']);
    $issue->update([
        'password' => 'our-own-password',
        'show_last_word' => false,
        'last_word_body' => '<p>Our own closing letter.</p>',
    ]);
    $passwordHash = $issue->password;
    $this->seed(IssueSeeder::class);
    $next = Issue::where('slug', '2026-2')->sole();
    expect(Issue::count())->toBe(2)->and(Event::count())->toBe(24)
        ->and($next->events)->toHaveCount(12)
        ->and(Hash::check('password', $next->password))->toBeTrue()
        ->and($next->show_last_word)->toBeTrue()
        ->and($next->last_word_body)->toContain('What a gift to look back on another year together.')
        ->and($next->events->first()->photos[0]['path'])->not->toBe($event->photos[0]['path'])
        ->and($issue->fresh()->password)->toBe($passwordHash)
        ->and(Hash::check('our-own-password', $issue->fresh()->password))->toBeTrue()
        ->and($issue->fresh()->show_last_word)->toBeFalse()
        ->and($issue->fresh()->last_word_body)->toBe('<p>Our own closing letter.</p>')
        ->and($event->fresh()->title)->toBe('Our own headline');
});

test('editors create and edit issue headers with private cover photographs', function () {
    $this->actingAs(User::factory()->create());
    $header = [
        'publication_name' => 'The Six Gazette',
        'motto' => 'Small moments. Lasting memories.',
        'edition_description' => 'Our holiday edition',
        'left_navigation_label' => 'Our stories',
        'right_navigation_label' => 'With gratitude',
        'cover_photo_alt' => 'Our family at the beach',
        'cover_headline' => "Days by\nthe sea",
        'cover_introduction' => 'Our favorite memories from {year}.',
        'cover_link_label' => 'Read our stories',
    ];

    Livewire::test(CreateIssue::class)
        ->fillForm([...$header, 'name' => '2026', 'cover_photo_path' => [UploadedFile::fake()->image('cover.jpg')]])
        ->call('create')
        ->assertHasNoFormErrors();

    $issue = Issue::sole();
    expect($issue->only(array_keys($header)))->toBe($header);
    Storage::disk('s3')->assertExists($issue->cover_photo_path);
    expect(Storage::disk('s3')->getVisibility($issue->cover_photo_path))->toBe('private');
    $originalPhoto = $issue->cover_photo_path;

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['name' => '2027', 'motto' => 'Another year together.', 'is_published' => true])
        ->call('save')
        ->assertHasNoFormErrors();
    expect($issue->fresh()->cover_photo_path)->toBe($originalPhoto)
        ->and($issue->fresh()->slug)->toBe('2026');

    auth()->logout();
    $this->get('/issues/2026')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('preview', false)
        ->where('issue.name', '2027')
        ->where('issue.publication_name', 'The Six Gazette')
        ->where('issue.motto', 'Another year together.')
        ->where('issue.edition_description', 'Our holiday edition')
        ->where('issue.left_navigation_label', 'Our stories')
        ->where('issue.right_navigation_label', 'With gratitude')
        ->where('issue.cover_headline', "Days by\nthe sea")
        ->where('issue.cover_introduction', 'Our favorite memories from 2027.')
        ->where('issue.cover_link_label', 'Read our stories')
        ->where('issue.cover_photo.alt', 'Our family at the beach')
        ->where('issue.cover_photo.src', fn (string $url) => str_starts_with($url, 'https://photos.example.test/issues/') && str_contains($url, '?expires='))
        ->missing('issue.cover_photo_path'));

    $this->actingAs(User::first());
    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['cover_photo_path' => [UploadedFile::fake()->image('replacement.png')]])
        ->call('save')->assertHasNoFormErrors();
    expect($issue->fresh()->cover_photo_path)->not->toBe($originalPhoto);
    Storage::disk('s3')->assertExists($issue->fresh()->cover_photo_path);

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['cover_photo_path' => []])
        ->call('save')->assertHasNoFormErrors();
    expect($issue->fresh()->cover_photo_path)->toBeNull();
    $this->get('/issues/2026/preview')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('preview', true)->where('issue.cover_photo', null)
        ->where('issue.cover_introduction', 'Our favorite memories from 2027.'));
});

test('the issue header form rejects invalid content and substituted cover paths', function () {
    $this->actingAs(User::factory()->create());
    $issue = Issue::factory()->create(['cover_photo_path' => 'issues/original.jpg']);
    Storage::disk('s3')->put('issues/original.jpg', 'original');
    Storage::disk('s3')->put('issues/someone-else.jpg', 'other');

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['cover_photo_path' => ['issues/someone-else.jpg']])
        ->call('save')->assertHasFormErrors(['cover_photo_path']);
    expect($issue->fresh()->cover_photo_path)->toBe('issues/original.jpg');

    Livewire::test(CreateIssue::class)
        ->fillForm([
            'name' => '2026',
            'publication_name' => '',
            'cover_photo_alt' => '',
            'cover_headline' => str_repeat('a', 256),
            'cover_introduction' => str_repeat('a', 2001),
            'cover_photo_path' => [UploadedFile::fake()->create('document.pdf', 5, 'application/pdf')],
        ])
        ->call('create')
        ->assertHasFormErrors(['publication_name', 'cover_photo_alt', 'cover_headline', 'cover_introduction', 'cover_photo_path']);
    expect(Issue::count())->toBe(1);
});

test('editors write edit and hide the optional Last Word without losing the letter', function () {
    $this->actingAs(User::factory()->create());
    $letter = [
        'show_last_word' => true,
        'last_word_title' => "A little note\nfrom home",
        'last_word_salutation' => 'Dear loved ones,',
        'last_word_body' => '<p>Thank you for a <strong>wonderful</strong> year.</p>',
        'last_word_sign_off' => 'With gratitude,',
        'last_word_signature' => 'Alex and family',
    ];

    Livewire::test(CreateIssue::class)
        ->fillForm(['name' => '2026', 'show_last_word' => true, 'last_word_body' => null])
        ->call('create')->assertHasFormErrors(['last_word_body'])
        ->fillForm($letter)
        ->call('create')->assertHasNoFormErrors();
    $issue = Issue::sole();
    expect($issue->only(array_keys($letter)))->toBe($letter);

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['name' => '2027', 'is_published' => true, 'last_word_title' => "Until next time,\nfriends"])
        ->call('save')->assertHasNoFormErrors();
    $this->get('/issues/2026/preview')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('preview', true)->where('issue.last_word.title', "Until next time,\nfriends"));
    auth()->logout();
    $this->get('/issues/2026')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('issue.name', '2027')
        ->where('issue.last_word.title', "Until next time,\nfriends")
        ->where('issue.last_word.salutation', 'Dear loved ones,')
        ->where('issue.last_word.sign_off', 'With gratitude,')
        ->where('issue.last_word.signature', 'Alex and family')
        ->where('issue.last_word.body', '<p>Thank you for a <strong>wonderful</strong> year.</p>'));

    $this->actingAs(User::first());
    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['show_last_word' => false])
        ->call('save')->assertHasNoFormErrors();
    expect($issue->fresh()->last_word_body)->toBe($letter['last_word_body']);
    $this->get('/issues/2026')->assertOk()->assertInertia(fn (Assert $page) => $page->where('issue.last_word', null));

    Livewire::test(EditIssue::class, ['record' => $issue->id])
        ->fillForm(['show_last_word' => true, 'last_word_signature' => '', 'publication_name' => 'Our Family Gazette'])
        ->call('save')->assertHasNoFormErrors();
    $this->get('/issues/2026')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('issue.last_word.signature', 'Our Family Gazette')
        ->where('issue.last_word.title', "Until next time,\nfriends"));
});

test('issue pages sanitize Last Word rich text before sending it to readers', function () {
    $issue = Issue::factory()->published()->create([
        'show_last_word' => true,
        'last_word_body' => '<p>With <em>love</em>.</p><script>alert(1)</script><img src="x" onerror="alert(1)">',
    ]);
    $this->get('/issues/'.$issue->slug)->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('issue.last_word.body', fn (string $body) => str_contains($body, '<em>love</em>') && ! str_contains($body, '<script') && ! str_contains($body, 'onerror')));
});
