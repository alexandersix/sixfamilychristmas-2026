<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->boolean('is_current')->default(false);
        });

        // PostgreSQL (production) and SQLite (tests) enforce this even for concurrent writes.
        DB::statement('CREATE UNIQUE INDEX issues_single_current ON issues (is_current) WHERE is_current = true');
    }

    public function down(): void
    {
        Schema::table('issues', function (Blueprint $table) {
            $table->dropIndex('issues_single_current');
            $table->dropColumn('is_current');
        });
    }
};
