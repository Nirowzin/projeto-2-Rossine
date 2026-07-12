<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'privilege_level' => 1,
            'status' => 'active'
        ]);
        
        // Gerente Example
        User::create([
            'name' => 'Manager',
            'email' => 'manager@admin.com',
            'password' => Hash::make('manager123'),
            'privilege_level' => 2,
            'status' => 'active'
        ]);

        // User Example
        User::create([
            'name' => 'Standard User',
            'email' => 'user@admin.com',
            'password' => Hash::make('user123'),
            'privilege_level' => 3,
            'status' => 'active'
        ]);
    }
}
