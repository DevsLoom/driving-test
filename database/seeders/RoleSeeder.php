<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Leafwrap\RoleSanctions\Models\Role;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::truncate();

        $payloads = [
            ['name' => 'Super Admin', 'grant_permission' => true],
            ['name' => 'Admin', 'grant_permission' => true],
        ];

        foreach ($payloads as $item) {
            Role::create($item);
        }
    }
}
