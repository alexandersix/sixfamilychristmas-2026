<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/option-1', 'option-1')->name('option-1');
Route::inertia('/option-2', 'option-2')->name('option-2');
Route::inertia('/styleguide', 'styleguide')->name('styleguide');
Route::inertia('/components', 'components')->name('components');
