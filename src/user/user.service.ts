import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll({ page = 1, pageSize = 10, search = '' }: { page?: number, pageSize?: number, search?: string }) {
    const db = this.databaseService.getDb();
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM users';
    const params: any[] = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR surname ILIKE $1';
      params.push(`%${search}%`);
    }

    query += search ? ' ORDER BY id ASC LIMIT $2 OFFSET $3' : ' ORDER BY id ASC LIMIT $1 OFFSET $2';
    params.push(pageSize, offset);

    const users = await db.any(query, params);
    const totalQuery = search ? 'SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR surname ILIKE $1' : 'SELECT COUNT(*) FROM users';
    const totalParams = search ? [`%${search}%`] : [];
    const total = await db.one(totalQuery, totalParams, (a: { count: string }) => +a.count);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async findOne(id: number) {
    const db = this.databaseService.getDb();
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
  }

  async create(createUserDto: CreateUserDto) {
    const db = this.databaseService.getDb();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    await db.none('INSERT INTO users(name, surname, email, password, phone, district, role) VALUES(${name}, ${surname}, ${email}, ${password}, ${phone}, ${district}, ${role})', { ...createUserDto, password: hashedPassword });
    return { ...createUserDto, password: hashedPassword };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const db = this.databaseService.getDb();
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = { ...existingUser, ...updateUserDto };

    if (updateUserDto.password) {
      updatedUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updateFields = Object.keys(updateUserDto).map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE users SET ${updateFields}, updatedat = CURRENT_TIMESTAMP WHERE id = $1`;
    const params = [id, ...Object.values(updateUserDto)];

    return db.none(query, params);
  }
  
  async remove(id: number, password: string) {
    const db = this.databaseService.getDb();
    const user = await this.findOne(id);

    if (user && await bcrypt.compare(password, user.password)) {
      return db.none('DELETE FROM users WHERE id = $1', [id]);
    } else {
      throw new Error('Invalid password');
    }
  }
}