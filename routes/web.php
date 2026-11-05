<?php

use App\Http\Controllers\IssueController;
use App\Http\Controllers\IssueLoginController;
use App\Http\Middleware\AuthorizeIssue;
use Filament\Http\Middleware\Authenticate;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(Authenticate::class)->group(function (): void {
    Route::inertia('/option-1', 'option-1')->name('option-1');
    Route::inertia('/option-2', 'option-2')->name('option-2');
    Route::inertia('/styleguide', 'styleguide')->name('styleguide');
    Route::inertia('/components', 'components')->name('components');
});

Route::get('/issues/{issue:slug}/login', [IssueLoginController::class, 'show'])->name('issues.login');
Route::post('/issues/{issue:slug}/login', [IssueLoginController::class, 'store'])->name('issues.login.store');
Route::middleware(AuthorizeIssue::class)->group(function (): void {
    Route::get('/issues/{issue:slug}', [IssueController::class, 'show'])->name('issues.show');
    Route::get('/issues/{issue:slug}/cover', [IssueController::class, 'cover'])->name('issues.cover');
    Route::get('/issues/{issue:slug}/events/{event}/photos/{photo}', [IssueController::class, 'photo'])
        ->whereNumber('event')->whereNumber('photo')->name('issues.photos.show');
});
Route::get('/issues/{issue:slug}/preview', [IssueController::class, 'preview'])
    ->middleware('auth')->name('issues.preview');
