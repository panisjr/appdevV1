<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class BookSeeder extends Seeder
{    
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            DB::table('books')->insert([
                'title' => $faker->sentence(3),
                'category' => $faker->randomElement(['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Biography']),
                'genre' => $faker->randomElement(['Fantasy', 'Thriller', 'Romance', 'Horror', 'Historical']),
                'author' => $faker->name,
                'publisher' => $faker->company,
                'date' => $faker->dateTimeBetween('-10 years', 'now')->format('Y-m-d'),
                'quantity' => $faker->boolean(70) ? $faker->numberBetween(1, 100) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
