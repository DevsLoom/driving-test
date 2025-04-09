<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payload = [
            [
                "type"       => "system",
                'role_id'    => 1,
                "first_name" => "John",
                "last_name"  => "Doe",
                "email"      => "hello@devsloom.ca",
                "phone"      => "+1234567890",
                "password"   => Hash::make('123456'),
                "status"     => 'active',
            ],
            [
                "type"       => "system",
                'role_id'    => 2,
                "first_name" => "Jane",
                "last_name"  => "Smith",
                "email"      => "admin@devsloom.ca",
                "phone"      => "+1234567891",
                "password"   => Hash::make('123456'),
                "status"     => 'active',
            ],
            [
                "type"       => "consumer",
                "first_name" => "Emily",
                "last_name"  => "Davis",
                "email"      => "emily@devsloom.ca",
                "phone"      => "+1234567892",
                "password"   => Hash::make('123456'),
                "status"     => 'active',
            ],
            [
                "type"       => "consumer",
                "first_name" => "James",
                "last_name"  => "Taylor",
                "email"      => "james@gmail.com",
                "phone"      => "12312312312",
                "password"   => Hash::make('123456'),
                "status"     => 'active',
            ],
        ];

        foreach ($payload as $item) {
            $user = User::create($item);
        }
    }
}
