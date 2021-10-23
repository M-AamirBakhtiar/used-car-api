import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  find(createUserDto: CreateUserDto): Promise<User[]> {
    const { email } = createUserDto;
    return this.userRepository.find({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`user with id of ${id} was not found`);
    }

    //Object.assign(user, updateUserDto);
    const newUser = { ...user, updateUserDto };

    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`user with id of ${id} was not found`);
    }

    return this.userRepository.remove(user);
  }
}
