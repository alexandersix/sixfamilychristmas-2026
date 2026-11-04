<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->string('publication_name')->default('The Six Family');
            $table->string('motto')->default('People. Places. Ordinary days. Extraordinary meaning.');
            $table->string('edition_description')->default('A year in review');
            $table->string('left_navigation_label')->default('Our year');
            $table->string('right_navigation_label')->default('With love');
            $table->string('cover_photo_path')->nullable();
            $table->string('cover_photo_alt')->default('Snow-dusted mountains and evergreen trees reflected in a quiet alpine lake');
            $table->string('cover_headline')->default("A year to\nhold on to");
            $table->text('cover_introduction')->default('The moments, big and small, that made our {year}.');
            $table->string('cover_link_label')->default('Open our year');
        });
    }

    public function down(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->dropColumn([
                'publication_name', 'motto', 'edition_description',
                'left_navigation_label', 'right_navigation_label',
                'cover_photo_path', 'cover_photo_alt', 'cover_headline',
                'cover_introduction', 'cover_link_label',
            ]);
        });
    }
};
