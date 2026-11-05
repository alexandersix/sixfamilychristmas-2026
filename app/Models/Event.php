<?php

namespace App\Models;

use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Validator;

/**
 * @property int $id
 * @property string $name
 * @property string $title
 * @property string|null $note
 * @property string $body
 * @property list<array{path: string, alt: string, caption?: string|null}> $photos
 * @property-read Collection<int, Issue> $issues
 */
#[Fillable(['name', 'title', 'note', 'body', 'photos'])]
class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasFactory;

    protected $attributes = ['photos' => '[]'];

    protected static function booted(): void
    {
        static::saving(function (Event $event): void {
            Validator::make($event->attributesToArray(), [
                'name' => ['required', 'string', 'max:255'],
                'title' => ['required', 'string', 'max:255'],
                'note' => ['nullable', 'string', 'max:255'],
                'body' => ['required', 'string'],
                'photos' => ['present', 'array', 'max:4'],
                'photos.*.path' => ['required', 'string', 'starts_with:events/', 'not_regex:/\.\./'],
                'photos.*.alt' => ['required', 'string', 'max:255'],
                'photos.*.caption' => ['nullable', 'string', 'max:255'],
            ])->validate();
        });
    }

    protected function casts(): array
    {
        return ['photos' => 'array'];
    }

    /** @return BelongsToMany<Issue, $this, IssueEvent> */
    public function issues(): BelongsToMany
    {
        return $this->belongsToMany(Issue::class)
            ->using(IssueEvent::class)
            ->withPivot(['id', 'position'])
            ->withTimestamps();
    }
}
