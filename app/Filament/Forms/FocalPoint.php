<?php

namespace App\Filament\Forms;

use App\Models\Event;
use App\Models\Issue;
use Closure;
use Filament\Forms\Components\Field;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class FocalPoint extends Field
{
    protected string $view = 'filament.forms.focal-point';

    protected string $imageField = 'path';

    public function imageField(string $name): static
    {
        $this->imageField = $name;

        return $this;
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Photo focus')
            ->default(['x' => 50, 'y' => 50])
            ->dehydrateStateUsing(fn (mixed $state): array => $state ?? ['x' => 50, 'y' => 50])
            ->afterStateHydrated(function (FocalPoint $component, mixed $state): void {
                if ($state === null) {
                    $component->state(['x' => 50, 'y' => 50]);
                }
            })
            ->rules([
                'nullable',
                'array:x,y',
                fn (): Closure => function (string $attribute, mixed $value, Closure $fail): void {
                    if (Validator::make(['point' => $value], [
                        'point.x' => ['required', 'numeric', 'between:0,100'],
                        'point.y' => ['required', 'numeric', 'between:0,100'],
                    ])->fails()) {
                        $fail('Choose a focal point within the photograph.');
                    }
                },
            ]);
    }

    public function getImageUrl(): ?string
    {
        $files = ($this->getGetCallback())($this->imageField);
        $file = is_array($files) ? (array_values($files)[0] ?? null) : $files;

        if ($file instanceof TemporaryUploadedFile) {
            return $file->isPreviewable() ? $file->temporaryUrl() : null;
        }

        $record = $this->getRecord();
        $allowed = match (true) {
            $record instanceof Event => array_column($record->photos, 'path'),
            $record instanceof Issue => [$record->cover_photo_path],
            default => [],
        };

        return is_string($file) && in_array($file, $allowed, true)
            ? Storage::disk()->temporaryUrl($file, now()->addHour())
            : null;
    }
}
