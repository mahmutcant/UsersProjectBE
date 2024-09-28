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
    /*const mockData = [
      { name: 'Mahmut Can', surname: 'Tuncer', email: 'mahcan012@gmail.com', password: await bcrypt.hash('123qwe', 10), phone: '5388208499', district: 'Adana', role: 'admin' },
      { name: 'Aybars', surname: 'Savrun', email: 'aybars.savrun@gmail.com', password: await bcrypt.hash('123456', 10), phone: '6548575415', district: 'Osmaniye', role: 'user' },
      { name: 'Sefa Enes', surname: 'Özoğuz', email: 'sefaenes.ozoguz@gmail.com', password: await bcrypt.hash('12345678', 10), phone: '123412344', district: 'Adana', role: 'user' },
    ];
  
    for (const data of mockData) {
      await this.db.none('INSERT INTO users(name, surname, email, password, phone, district, role) VALUES(${name}, ${surname}, ${email}, ${password}, ${phone}, ${district}, ${role})', data);
    }*/
  }

  getDb() {
    return this.db;
  }
}