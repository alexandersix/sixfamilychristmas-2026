<?php

use App\Models\Issue;
use App\Models\User;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('guests must log in to Filament to access the designs and design system', function (string $option) {
    $this->get('/'.$option)->assertRedirect('/admin/login');
})->with(['option-1', 'option-2', 'styleguide', 'components']);

test('an issue password does not grant access to the designs and design system', function (string $option) {
    $issue = Issue::factory()->published()->create(['password' => 'family-password']);
    $this->post(route('issues.login.store', $issue), ['password' => 'family-password'])
        ->assertRedirect(route('issues.show', $issue));
    $this->assertGuest();

    $this->get('/'.$option)->assertRedirect('/admin/login');
})->with(['option-1', 'option-2', 'styleguide', 'components']);

test('Filament login grants access to the designs and design system', function (string $option) {
    $user = User::factory()->admin()->create();
    Filament::setCurrentPanel(Filament::getPanel('admin'));

    Livewire::test(Login::class)
        ->fillForm(['email' => $user->email, 'password' => 'password'])
        ->call('authenticate')
        ->assertHasNoFormErrors();

    $this->get('/'.$option)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($option));
})->with(['option-1', 'option-2', 'styleguide', 'components']);

test('non-admin sessions cannot access the designs and design system', function (string $option) {
    $this->actingAs(User::factory()->create())
        ->get('/'.$option)->assertForbidden();
})->with(['option-1', 'option-2', 'styleguide', 'components']);
