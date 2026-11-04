<?php

use App\Models\User;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Livewire\Livewire;

test('guests must log in to access the admin panel', function () {
    $this->get('/admin')->assertRedirect('/admin/login');
    $this->get('/admin/login')->assertOk()->assertSee('Sign in');
});

test('any user can log in and access the admin panel outside local development', function () {
    app()->detectEnvironment(fn () => 'production');
    $user = User::factory()->unverified()->create();
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

test('development seeding is repeatable and preserves existing credentials', function () {
    app()->detectEnvironment(fn () => 'local');
    $this->seed();

    $user = User::where('email', 'test@example.com')->firstOrFail();
    expect(Hash::check('password', $user->password))->toBeTrue();

    $user->update(['password' => 'changed-password']);
    $this->seed();

    $this->assertDatabaseCount('users', 1);
    expect(Hash::check('changed-password', $user->fresh()->password))->toBeTrue();
});

test('the development account is not seeded in production', function () {
    app()->detectEnvironment(fn () => 'production');
    $this->seed();

    $this->assertDatabaseCount('users', 0);
});
