import { Injectable, OnModuleInit } from '@nestjs/common';
import * as pgPromise from 'pg-promise';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: any;
  private dbPassword = process.env.DB_PASSWORD;
  async onModuleInit() {
    const pgp = pgPromise();
    const connection = pgp(`postgres://postgres:${this.dbPassword}@localhost:5432/postgres`);

    const dbExists = await connection.oneOrNone(`
      SELECT 1 FROM pg_database WHERE datname = 'usersdot'
    `);

    if (!dbExists) {
      await connection.none('CREATE DATABASE usersdot');
    }

    this.db = pgp('postgres://postgres:123qwe@localhost:5432/usersdot');

    await this.createTableIfNotExists();
    await this.insertMockData();
  }

  private async createTableIfNotExists() {
    await this.db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        surname VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        phone VARCHAR(15),
        district VARCHAR(100),
        role VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private async insertMockData() {
    const mockData = [
      { name: 'Mahmut Can', surname: 'Tuncer', email: 'mahcan012@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'admin' },
      { name: 'Fernando', surname: 'Muslera', email: 'f.muslera@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Mersin', role: 'user' },
      { name: 'Cenk', surname: 'Şen', email: 'cenk.sen@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Olivier', surname: 'Ntcham', email: 'mahcan0125@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Mersin', role: 'user' },
      { name: 'Uğurcan', surname: 'Çakır', email: 'mahcan0126@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Rafa', surname: 'Silva', email: 'mahcan0127@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Mersin', role: 'user' },
      { name: 'Nuno Da', surname: 'Costa', email: 'nuno.da.costa@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Edin', surname: 'Dzeko', email: 'edin.dzeko@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Dries', surname: 'Mertens', email: 'dries.mertens@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Marc', surname: 'Bola', email: 'marc.bola@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Jonas', surname: 'Svensson', email: 'jonas.svensson@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Victor', surname: 'Nelsson', email: 'victor.nelsson@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Allan Saint', surname: 'Maximin', email: 'allan.maxi8@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Barış Alper', surname: 'Yılmaz', email: 'bay@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Ahmet Can', surname: 'Yıldırım', email: 'ahmetcan@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Mahmut Can', surname: 'Yıldırım', email: 'mahcan0122@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Mehmet Can', surname: 'Yıldırım', email: 'mehmetcan.yildirim@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Yunus Can', surname: 'Yıldırım', email: 'yunus_can_yildirim@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Murat', surname: 'Yıldırım', email: 'murat.yildirim@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
      { name: 'Gökhan', surname: 'Yıkılkan', email: 'gokhan.yikilkan@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'user' },
    ];
  
    for (const data of mockData) {
      await this.db.none('INSERT INTO users(name, surname, email, password, phone, district, role) VALUES(${name}, ${surname}, ${email}, ${password}, ${phone}, ${district}, ${role})', data);
    }
  }

  getDb() {
    return this.db;
  }
}