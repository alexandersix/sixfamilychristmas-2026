<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Event> */
class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'title' => fake()->sentence(),
            'note' => fake()->sentence(),
            'body' => '<p>'.fake()->paragraph().'</p>',
            'photos' => [[
                'path' => 'events/'.fake()->uuid().'.jpg',
                'alt' => 'A family memory',
                'caption' => fake()->sentence(),
            ]],
        ];
    }
}
