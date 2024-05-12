import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.password;
    delete owner.email;

    const newWish = this.wishesRepository.create({
      ...createWishDto,
      owner: owner,
    });

    return this.wishesRepository.save(newWish);
  }

  async findMany(query: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(query);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден!');
    }

    return wish;
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден!');
    }

    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя скопировать собственный подарок!');
    }

    await this.wishesRepository.update(wishId, {
      copied: (wish.copied = wish.copied + 1),
    });

    const wishCopy = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
      copied: 0,
    };

    delete wishCopy.id;
    delete wishCopy.createdAt;
    delete wishCopy.updatedAt;

    await this.create(user, wishCopy);

    return {};
  }

  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден!');
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Редактировать чужой подарок запрещено!');
    }

    if (wish.raised > 0 && wish.offers.length > 0) {
      throw new ForbiddenException(
        'Редактировать подарок, на который уже начат сбор, запрещено!',
      );
    }

    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  async updateRaisedSum(wishId: number, sum: number) {
    return await this.wishesRepository.update(wishId, { raised: sum });
  }

  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден!');
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Удалять чужие подарки запрещено!');
    }

    if (wish.raised > 0 && wish.offers.length > 0) {
      throw new ForbiddenException(
        'Удалять подарок, на который уже начат сбор, запрещено!',
      );
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }
}
