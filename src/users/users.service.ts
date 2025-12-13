import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    return this.excludePassword(user);
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(user => this.excludePassword(user));
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.users.find(user => user.id === id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.excludePassword(user);
  }

  remove(id: string): void {
    const index = this.users.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
