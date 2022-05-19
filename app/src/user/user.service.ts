import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntityFactory } from './entities/user.entity.factory';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repo: Repository<User>,
  ) {}

  async create(dto: UserCreateDto) {
    const user = UserEntityFactory.fromCreateDto(dto);

    user.password = await this.hashPassword(user.password);

    return this._repo.save(user);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async checkPassword(password: string, login: string): Promise<User | null> {
    const user = await this._repo.findOne({ login });

    if (!user) {
      return null;
    }

    const isGood = await compare(password, user.password);

    return isGood ? user : null;
  }

  findAll() {
    return this._repo.find();
  }

  findOne(id: number) {
    return this._repo.findOne({
      id,
    });
  }

  update(id: number, updateUserDto: UserUpdateDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this._repo.delete(id);
  }
}
