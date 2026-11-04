<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->boolean('show_last_word')->default(false);
            $table->string('last_word_title')->default("A note from\nthe family");
            $table->string('last_word_salutation')->default('Dear friends and family,');
            $table->text('last_word_body')->nullable();
            $table->string('last_word_sign_off')->default('With love,');
            $table->string('last_word_signature')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->dropColumn([
                'show_last_word', 'last_word_title', 'last_word_salutation',
                'last_word_body', 'last_word_sign_off', 'last_word_signature',
            ]);
        });
    }
};
