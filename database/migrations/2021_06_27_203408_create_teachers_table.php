<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeachersTable extends Migration
{
    public function up()
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp("password_rested_at")->nullable();
            $table->string('password');
            $table->timestamps();
            $table->engine = 'InnoDB';
        });
    }

    public function down()
    {
        Schema::dropIfExists('teachers');
    }
}
