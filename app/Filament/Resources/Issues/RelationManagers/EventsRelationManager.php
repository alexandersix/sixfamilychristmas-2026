<?php

namespace App\Filament\Resources\Issues\RelationManagers;

use App\Filament\Resources\Events\EventResource;
use Filament\Actions\AttachAction;
use Filament\Actions\CreateAction;
use Filament\Actions\DetachAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class EventsRelationManager extends RelationManager
{
    protected static string $relationship = 'events';

    public function form(Schema $schema): Schema
    {
        return EventResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->description('Create a new event or add one from the library. Use Reorder to change the reading order. Removing an event here keeps it in the library and other issues.')
            ->reorderable('position')
            ->defaultSort('event_issue.position')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('title')->label('Headline'),
            ])
            ->headerActions([
                CreateAction::make()->label('Create new event'),
                AttachAction::make()
                    ->label('Add existing event')
                    ->modalHeading('Add existing event')
                    ->modalSubmitActionLabel('Add to issue')
                    ->attachAnother(false)
                    ->recordSelect(fn (Select $select): Select => $select->label('Event')->placeholder('Choose an event'))
                    ->preloadRecordSelect(),
            ])
            ->recordActions([
                EditAction::make(),
                DetachAction::make()->label('Remove from issue'),
            ]);
    }
}
