<?php

namespace App\Filament\Resources\Issues;

use App\Filament\Resources\Issues\Pages\CreateIssue;
use App\Filament\Resources\Issues\Pages\EditIssue;
use App\Filament\Resources\Issues\Pages\ListIssues;
use App\Filament\Resources\Issues\RelationManagers\EventsRelationManager;
use App\Models\Issue;
use BackedEnum;
use Closure;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Validation\Rules\Password;

class IssueResource extends Resource
{
    protected static ?string $model = Issue::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->helperText('For example, 2026. A permanent web address is generated when you create the issue.')
                    ->required()
                    ->maxLength(200),
                TextInput::make('slug')
                    ->label('Web address')
                    ->prefix('/issues/')
                    ->disabled()
                    ->visibleOn('edit')
                    ->helperText('This stays the same if you rename the issue, so shared links keep working.'),
                TextInput::make('password')
                    ->label('Issue password')
                    ->password()
                    ->autocomplete('new-password')
                    ->placeholder(fn (?Issue $record): string => filled($record?->password) ? 'Password is set' : 'No password set')
                    ->afterStateHydrated(fn (TextInput $component) => $component->state(null))
                    ->dehydrated(fn (?string $state): bool => filled($state))
                    ->rules([
                        Password::defaults(),
                        fn (): Closure => function (string $attribute, string $value, Closure $fail): void {
                            if (strlen($value) > 72) {
                                $fail('The issue password must be at most 72 bytes.');
                            }
                        },
                    ])
                    ->helperText('Use a strong, unique password (at most 72 bytes). Leave blank to keep the current password. Passwords are stored securely and cannot be displayed. Viewer password protection is not enabled yet.'),
                Toggle::make('is_published')
                    ->label('Publish issue')
                    ->helperText('Off means draft: only signed-in editors can preview it. On makes it public. There is no family password gate yet.')
                    ->default(false),
                Section::make('Masthead')
                    ->description('The year comes from the issue name. Navigation destinations are set automatically.')
                    ->schema([
                        TextInput::make('publication_name')
                            ->label('Family / publication name')
                            ->default('The Six Family')->required()->maxLength(255),
                        TextInput::make('motto')
                            ->label('Motto / tagline')
                            ->default('People. Places. Ordinary days. Extraordinary meaning.')
                            ->required()->maxLength(255),
                        TextInput::make('edition_description')
                            ->default('A year in review')->required()->maxLength(255)
                            ->helperText('Preview mode displays “Editor preview” instead.'),
                        TextInput::make('left_navigation_label')
                            ->default('Our year')->required()->maxLength(255)
                            ->helperText('Links to this issue’s contents.'),
                        TextInput::make('right_navigation_label')
                            ->default('With love')->required()->maxLength(255)
                            ->helperText('Links to the footer.'),
                    ])->columnSpanFull(),
                Section::make('Cover')
                    ->schema([
                        FileUpload::make('cover_photo_path')
                            ->label('Cover photograph')
                            ->disk('s3')->directory('issues')->visibility('private')
                            ->preventFilePathTampering(allowFilePathUsing: fn (string $file, ?Issue $record): bool => $file === $record?->cover_photo_path)
                            ->image()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(12288)
                            ->helperText('JPEG, PNG, or WebP. Up to 12 MB. Until you upload a photo, the sample lake photograph is shown.'),
                        TextInput::make('cover_photo_alt')
                            ->label('Cover image description')
                            ->default('Snow-dusted mountains and evergreen trees reflected in a quiet alpine lake')
                            ->helperText('Describe your cover photograph for people using screen readers. Update this when you change the photo.')
                            ->required()->maxLength(255),
                        Textarea::make('cover_headline')
                            ->default("A year to\nhold on to")
                            ->helperText('Use a new line for each display line. Short lines work best in the large cover type.')
                            ->rows(2)->required()->maxLength(255),
                        Textarea::make('cover_introduction')
                            ->default('The moments, big and small, that made our {year}.')
                            ->helperText('Use {year} to insert the issue name automatically.')
                            ->rows(3)->required()->maxLength(2000),
                        TextInput::make('cover_link_label')
                            ->default('Open our year')->required()->maxLength(255)
                            ->helperText('Links to this issue’s contents.'),
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
                TextColumn::make('events_count')->counts('events')->label('Events'),
                IconColumn::make('is_published')->label('Published')->boolean(),
            ])
            ->defaultSort('id', 'desc')
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            EventsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListIssues::route('/'),
            'create' => CreateIssue::route('/create'),
            'edit' => EditIssue::route('/{record}/edit'),
        ];
    }
}
