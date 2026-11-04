<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Issue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class IssueSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing') || Issue::where('slug', '2026')->exists()) {
            return;
        }

        $photos = [
            ['breakfast', 'A breakfast table beside a bright window', 'Wilfredor, CC0', "Breakfast in Île d'Orléans 072.jpg"],
            ['cake', 'Apple cake with vanilla ice cream', 'W.carter, CC0', 'Apple cake with vanilla ice cream 2.jpg'],
            ['blossom', 'Apple blossoms against a blue sky', 'George Chernilevsky, public domain', 'Apple-tree blossoms 2017 G3.jpg'],
            ['apple-basket', 'A basket of freshly picked apples', 'George Chernilevsky, public domain', 'Apples in basket 2018 G1.jpg'],
        ];

        $storedPhotos = [];
        $credits = '';
        foreach ($photos as [$name, $alt, $credit, $source]) {
            $path = 'events/demo/'.$name.'.webp';
            if (! Storage::disk('s3')->put($path, File::get(public_path('images/option-2/'.$name.'-1920.webp')), 'private')) {
                throw new RuntimeException('Could not store sample photographs. Check the S3 configuration.');
            }
            $storedPhotos[] = ['path' => $path, 'alt' => $alt, 'caption' => 'Photo: '.$credit];
            $credits .= '<li><a href="https://commons.wikimedia.org/wiki/File:'.rawurlencode($source).'">'.$credit.'</a></li>';
        }

        DB::transaction(function () use ($storedPhotos, $credits): void {
            $issue = Issue::create(['name' => '2026']);

            foreach ([
                ['Birthday breakfast', 'Another candle. Another slice.'],
                ['Around the table', 'The best seat was at our table.'],
                ['First blooms', 'And then, everything bloomed.'],
                ['At the orchard', 'A basket full of good things.'],
                ['Slow mornings', 'Nowhere to be but here.'],
                ['Something sweet', 'Made for sharing.'],
                ['In the garden', 'Good things take their time.'],
                ['The afternoon harvest', 'A little sunshine to bring home.'],
                ['Sunday breakfast', 'A reason to linger.'],
                ['One more slice', 'There is always room at the table.'],
                ['Out in the sunshine', 'The ordinary days were the good ones.'],
                ['Home for the holidays', 'Together is our favorite place.'],
            ] as $index => [$name, $title]) {
                $event = Event::create([
                    'name' => $name,
                    'title' => $title,
                    'note' => 'A little moment worth keeping.',
                    'body' => '<p>Example story: replace this with a memory from your year. Add a few details, a favorite moment, and the people who made it special.</p><p>These are sample photos, not family photographs. Photo credits (Wikimedia Commons):</p><ul>'.$credits.'</ul>',
                    'photos' => array_slice($storedPhotos, 0, ($index % 4) + 1),
                ]);
                $issue->events()->attach($event);
            }
        });
    }
}
