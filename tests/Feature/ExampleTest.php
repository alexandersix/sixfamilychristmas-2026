<?php

use Inertia\Testing\AssertableInertia as Assert;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('the Christmas card designs and design system are publicly accessible', function (string $option) {
    $this->get('/'.$option)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($option));
})->with(['option-1', 'option-2', 'styleguide', 'components']);
