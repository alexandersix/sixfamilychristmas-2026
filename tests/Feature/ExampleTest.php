<?php

use App\Models\Issue;
use App\Models\User;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

test('the homepage returns 404 without a current issue rather than choosing another issue', function () {
    $this->get(route('home'))->assertNotFound();
    Issue::factory()->published()->create();
    $this->get(route('home'))->assertNotFound();
});

test('the homepage redirects immediately to the current permanent issue address', function () {
    $issue = Issue::factory()->published()->create([
        'name' => 'Family Christmas', 'is_current' => true, 'password' => 'family-password',
    ]);
    Issue::factory()->published()->create(['name' => '2099']);
    $issue->update(['name' => 'Renamed edition']);

    $this->get(route('home'))->assertRedirect('/family-christmas')
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertDontSee("Let's get started");
    $this->followingRedirects()->get(route('home'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('issues/login')->missing('issue'));

    $this->post('/issues/family-christmas/login', ['password' => 'family-password'])->assertSessionHasNoErrors();
    $this->followingRedirects()->get(route('home'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('issues/show'));
});

test('current selection does not bypass draft or passwordless issue restrictions', function (bool $published, int $status) {
    Issue::factory()->create(['is_current' => true, 'is_published' => $published]);
    $this->followingRedirects()->get(route('home'))->assertStatus($status);
})->with([[false, 404], [true, 403]]);

test('removing the current issue leaves no homepage destination', function () {
    $issue = Issue::factory()->create(['is_current' => true]);
    $issue->delete();
    $this->get(route('home'))->assertNotFound();
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
