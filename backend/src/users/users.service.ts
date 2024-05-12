import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if ((await this.findByUsername(createUserDto.username)) !== null) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже существует!',
      );
    }

    if ((await this.findByEmail(createUserDto.email)) !== null) {
      throw new ForbiddenException(
        'Пользователь с такой почтой уже существует!',
      );
    }

    const user = this.usersRepository.create(createUserDto);
    user.password = await this.hashService.generateHash(user.password);

    return await this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findMany({ query }: FindUsersDto): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const user = await this.findByUsername(updateUserDto.username);

      if (user !== null && user.id !== id) {
        throw new ForbiddenException(
          'Пользователь с таким именем уже существует!',
        );
      }
    }

    if (updateUserDto.email) {
      const user = await this.findByEmail(updateUserDto.email);
      if (user !== null && user.id !== id) {
        throw new ForbiddenException(
          'Пользователь с такой почтой уже существует!',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.generateHash(
        updateUserDto.password,
      );
    }

    await this.usersRepository.update({ id }, updateUserDto);

    const updatedUser = await this.findOne(id);
    delete updatedUser.password;

    return updatedUser;
  }

  async getUserWishes(id: number) {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });

    return wishes;
  }

  async removeOne(id: number) {
    return await this.usersRepository.delete({ id });
  }
}
