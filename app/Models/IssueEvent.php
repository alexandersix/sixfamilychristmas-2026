<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $issue_id
 * @property int $position
 */
class IssueEvent extends Pivot
{
    protected $table = 'event_issue';

    public $incrementing = true;

    protected static function booted(): void
    {
        static::creating(function (IssueEvent $placement): void {
            $placement->position ??= ((int) static::where('issue_id', $placement->issue_id)->max('position')) + 1;
        });
    }
}
