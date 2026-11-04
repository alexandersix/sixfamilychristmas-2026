<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('note')->nullable();
            $table->text('body');
            $table->jsonb('photos');
            $table->timestamps();
        });

        Schema::create('event_issue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('issue_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('position');
            $table->timestamps();
            $table->unique(['issue_id', 'event_id']);
            $table->index(['issue_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_issue');
        Schema::dropIfExists('events');
        Schema::dropIfExists('issues');
    }
};
