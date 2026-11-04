<?php

namespace App\Filament\Resources\Issues\Pages;

use App\Filament\Resources\Issues\IssueResource;
use App\Models\Issue;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditIssue extends EditRecord
{
    protected static string $resource = IssueResource::class;

    protected function afterSave(): void
    {
        $this->data['password'] = null;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview')
                ->url(fn (Issue $record): string => route('issues.preview', $record->slug))
                ->openUrlInNewTab(),
            DeleteAction::make()
                ->modalDescription('Delete this issue? Its events remain in the event library and any other issues.'),
        ];
    }
}
