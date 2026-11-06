1. Tech Stack Yang Digunakan
  - Express.js
  - PostgREST version 14.18
2. Petunjuk Instalasi local
  - gunakan atau download Node.js v20.11.1
  - gunakan atau pasang PostgREST version 14.18
  - clone project BE: git clone https://github.com/aminsum9/aplikasi-pengelolaan-barang-be.git
  - masuk ke project BE lalu jalankan: npm install
  - buat file .env dan isi dengan 2 variabel contohnya:

    BEARER_TOKER=rahasia
    DATABASE_URL=postgresql://username:password@localhost:5432/nama_database

  - untuk melakukan migrasi database jalankan: npx sequelize db:migrate
  - untuk menjalankan server jalankan: nodemon
3. Akun yang bisa dicoba:
  - jika di server remote: 
    - username: admin
    - password: password123
  - jika di server local bisa hit api untuk membuat akun dummy:
    POST http://localhost:5000/user/register

    request body:
    {
        "role": "admin",
        "username": "admin",
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "password123"
    }
