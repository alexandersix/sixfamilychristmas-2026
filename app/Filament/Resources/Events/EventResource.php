<?php

namespace App\Filament\Resources\Events;

use App\Filament\Resources\Events\Pages\CreateEvent;
use App\Filament\Resources\Events\Pages\EditEvent;
use App\Filament\Resources\Events\Pages\ListEvents;
use App\Models\Event;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Story')
                    ->description('Events can appear in several issues. Editing a shared event updates it everywhere. To delete an event, remove it from all issues first.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Event name')
                            ->helperText('A short name for the contents, such as Beach week.')
                            ->required()->maxLength(255),
                        TextInput::make('title')
                            ->label('Headline')
                            ->required()->maxLength(255),
                        TextInput::make('note')
                            ->label('Short introduction')
                            ->maxLength(255),
                        RichEditor::make('body')
                            ->label('Story')
                            ->toolbarButtons([
                                ['bold', 'italic', 'link'],
                                ['bulletList', 'orderedList'],
                                ['undo', 'redo'],
                            ])
                            ->required(),
                    ])->columnSpanFull(),
                Section::make('Photographs')
                    ->description('Add 1–4 photos. The layout automatically fits the number of photos, just like the example page. Drag to reorder; the first photo leads the story.')
                    ->schema([
                        Repeater::make('photos')
                            ->hiddenLabel()
                            ->schema([
                                FileUpload::make('path')
                                    ->label('Photo')
                                    ->disk('s3')->directory('events')->visibility('private')
                                    ->preventFilePathTampering(allowFilePathUsing: fn (string $file, ?Event $record): bool => in_array($file, array_column($record->photos ?? [], 'path'), true))
                                    ->image()
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                    ->maxSize(12288)
                                    ->helperText('JPEG, PNG, or WebP. Up to 12 MB.')
                                    ->required(),
                                TextInput::make('alt')
                                    ->label('Image description')
                                    ->helperText('Describe what is pictured for people using screen readers.')
                                    ->required()->maxLength(255),
                                TextInput::make('caption')->maxLength(255),
                            ])
                            ->minItems(1)->maxItems(4)->defaultItems(1)
                            ->addActionLabel('Add photo')
                            ->reorderableWithButtons()
                            ->itemLabel(fn (array $state): string => $state['alt'] ?? 'New photo'),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('title')->label('Headline')->searchable(),
                TextColumn::make('issues_count')->counts('issues')->label('Used in issues'),
            ])
            ->defaultSort('id', 'desc')
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEvents::route('/'),
            'create' => CreateEvent::route('/create'),
            'edit' => EditEvent::route('/{record}/edit'),
        ];
    }
}
