<?php

namespace App\Models;

use Database\Factories\IssueFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property bool $is_published
 * @property string|null $password
 * @property-read Collection<int, Event> $events
 */
#[Fillable(['name', 'is_published', 'password'])]
#[Hidden(['password'])]
class Issue extends Model
{
    /** @use HasFactory<IssueFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Issue $issue): void {
            $base = Str::slug($issue->name) ?: 'issue';
            $issue->slug = $base;
            $suffix = 2;

            while (static::where('slug', $issue->slug)->exists()) {
                $issue->slug = $base.'-'.$suffix++;
            }
        });
    }

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /** @return BelongsToMany<Event, $this, IssueEvent> */
    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)
            ->using(IssueEvent::class)
            ->withPivot(['id', 'position'])
            ->withTimestamps()
            ->orderByPivot('position')
            ->orderBy('events.id');
    }
}
