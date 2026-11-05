<?php

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Models\User;
use Filament\Auth\Pages\EditProfile;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Livewire\Livewire;

test('guests must log in to access the admin panel', function () {
    $this->get('/admin')->assertRedirect('/admin/login');
    $this->get('/admin/login')->assertOk()->assertSee('Sign in');
});

test('admins can log in and access the admin panel outside local development', function () {
    app()->detectEnvironment(fn () => 'production');
    $user = User::factory()->admin()->unverified()->create();
    Filament::setCurrentPanel(Filament::getPanel('admin'));

    Livewire::test(Login::class)
        ->set('data', [
            'email' => $user->email,
            'password' => 'incorrect-password',
        ])
        ->call('authenticate')
        ->assertHasFormErrors(['email']);

    $this->assertGuest();

    Livewire::test(Login::class)
        ->set('data', [
            'email' => $user->email,
            'password' => 'password',
        ])
        ->call('authenticate')
        ->assertHasNoFormErrors()
        ->assertRedirect('/admin');

    $this->assertAuthenticatedAs($user);
    $this->get('/admin')->assertOk()->assertSee('Dashboard');
});

test('the admin migration preserves existing access and defaults future accounts to non-admin', function () {
    $migration = require database_path('migrations/2026_11_05_000000_add_is_admin_to_users_table.php');
    $migration->down();
    $existing = User::factory()->create();
    $password = $existing->password;

    $migration->up();

    expect($existing->fresh()->is_admin)->toBeTrue()
        ->and($existing->fresh()->password)->toBe($password)
        ->and(User::factory()->create()->fresh()->is_admin)->toBeFalse();
});

test('non-admins cannot log in or access panel pages with an existing session', function () {
    $user = User::factory()->create();
    expect($user->fresh()->is_admin)->toBeFalse();
    Filament::setCurrentPanel(Filament::getPanel('admin'));

    Livewire::test(Login::class)
        ->fillForm(['email' => $user->email, 'password' => 'password'])
        ->call('authenticate')
        ->assertHasFormErrors(['email']);

    $this->assertGuest();
    $this->actingAs($user);

    foreach (['/admin', '/admin/profile', '/admin/users', '/admin/users/create'] as $url) {
        $this->get($url)->assertForbidden();
    }
});

test('admins create other admins with validated credentials', function () {
    $this->actingAs(User::factory()->admin()->create());
    Filament::setCurrentPanel(Filament::getPanel('admin'));
    $this->get('/admin/users')->assertOk()->assertSee('New user');

    $page = Livewire::test(CreateUser::class)
        ->fillForm([
            'name' => 'New Editor',
            'email' => 'editor@example.com',
            'password' => 'new-password',
            'password_confirmation' => 'does-not-match',
        ])
        ->call('create')
        ->assertHasFormErrors(['password' => 'confirmed']);

    $this->assertDatabaseCount('users', 1);

    $page->fillForm(['password_confirmation' => 'new-password'])
        ->call('create')
        ->assertHasNoFormErrors();

    $created = User::where('email', 'editor@example.com')->firstOrFail();
    expect($created->is_admin)->toBeTrue()
        ->and(Hash::check('new-password', $created->password))->toBeTrue();

    Livewire::test(CreateUser::class)
        ->fillForm([
            'name' => 'Duplicate',
            'email' => $created->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->call('create')
        ->assertHasFormErrors(['email' => 'unique']);
});

test('admins can edit their own profile and password without changing other accounts', function () {
    $user = User::factory()->admin()->create();
    $other = User::factory()->admin()->create();
    $this->actingAs($user);
    Filament::setCurrentPanel(Filament::getPanel('admin'));
    $this->get('/admin/profile')->assertOk();

    $page = Livewire::test(EditProfile::class)
        ->fillForm(['name' => 'Updated Name'])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($user->fresh()->name)->toBe('Updated Name')
        ->and(Hash::check('password', $user->fresh()->password))->toBeTrue();

    $page->fillForm([
        'email' => 'updated@example.com',
        'password' => 'updated-password',
        'passwordConfirmation' => 'updated-password',
        'currentPassword' => 'wrong-password',
    ])->call('save')->assertHasFormErrors(['currentPassword']);

    $page->fillForm(['currentPassword' => 'password'])
        ->call('save')->assertHasNoFormErrors();

    expect($user->fresh()->email)->toBe('updated@example.com')
        ->and(Hash::check('updated-password', $user->fresh()->password))->toBeTrue()
        ->and($user->fresh()->is_admin)->toBeTrue()
        ->and($other->fresh()->email)->toBe($other->email)
        ->and(Hash::check('password', $other->fresh()->password))->toBeTrue();
});

test('account passwords require only more than eight characters', function (string $environment) {
    app()->detectEnvironment(fn () => $environment);
    $user = User::factory()->admin()->create();
    $this->actingAs($user);
    Filament::setCurrentPanel(Filament::getPanel('admin'));

    $page = Livewire::test(CreateUser::class)
        ->set('data', [
            'name' => 'New Editor',
            'email' => 'editor@example.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
        ])
        ->call('create')
        ->assertHasFormErrors(['password']);

    $page->set('data.password', '123456789')
        ->set('data.password_confirmation', '123456789')
        ->call('create')->assertHasNoFormErrors();

    expect(Hash::check('123456789', User::where('email', 'editor@example.com')->firstOrFail()->password))->toBeTrue();

    $profile = Livewire::test(EditProfile::class)
        ->set('data.password', 'abcdefgh')
        ->set('data.passwordConfirmation', 'abcdefgh')
        ->set('data.currentPassword', 'password')
        ->call('save')
        ->assertHasFormErrors(['password']);

    $profile->set('data.password', 'abcdefghi')
        ->set('data.passwordConfirmation', 'abcdefghi')
        ->call('save')->assertHasNoFormErrors();

    expect(Hash::check('abcdefghi', $user->fresh()->password))->toBeTrue();
})->with(['testing', 'production']);

test('development seeding is repeatable and preserves existing credentials', function () {
    Storage::fake('s3');
    app()->detectEnvironment(fn () => 'local');
    $this->seed();

    $user = User::where('email', 'test@example.com')->firstOrFail();
    expect(Hash::check('password', $user->password))->toBeTrue()
        ->and($user->is_admin)->toBeTrue();

    $user->update(['password' => 'changed-password']);
    $this->seed();

    $this->assertDatabaseCount('users', 1);
    expect(Hash::check('changed-password', $user->fresh()->password))->toBeTrue();
});

test('the development account is not seeded in production', function () {
    app()->detectEnvironment(fn () => 'production');
    $this->seed();

    $this->assertDatabaseCount('users', 0);
    $this->assertDatabaseCount('issues', 0);
    $this->assertDatabaseCount('events', 0);
});
