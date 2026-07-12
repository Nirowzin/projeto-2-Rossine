<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('code'); // 'Código' mapped to PK
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('privilege_level')->default(3)->comment('1: Admin, 2: Manager, 3: User');
            $table->string('status')->default('active')->comment('active or inactive');
            $table->rememberToken();
            $table->timestamps(); // Data cadastro, Data alteração
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
