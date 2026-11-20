<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('issues', function (Blueprint $table): void {
            $table->json('cover_focal_point')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('issues', function (Blueprint $table): void {
            $table->dropColumn('cover_focal_point');
        });
    }
};
