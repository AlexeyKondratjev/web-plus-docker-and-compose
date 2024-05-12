import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async findMany() {
    const wishlists = await this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });

    wishlists.forEach((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
    });

    return wishlists;
  }

  async findWishlistsById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    delete wishlist.owner.password;
    delete wishlist.owner.email;

    return wishlist;
  }

  async create(owner: User, createWishlistDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;

    const allWishes = await this.wishesService.findMany({});

    const wishesToList = createWishlistDto.itemsId.map((item) => {
      return allWishes.find((wish) => wish.id === item);
    });

    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: owner,
      items: wishesToList,
    });

    return await this.wishlistsRepository.save(newWishlist);
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return await this.wishlistsRepository.findOne(query);
  }

  async updateOne(
    user: User,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findWishlistsById(wishlistId);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден!');
    }

    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Редактировать чужой вишлист запрещено!');
    }

    await this.wishlistsRepository.update(wishlistId, updateWishlistDto);

    const updatedWishlist = await this.findOne({
      where: { id: wishlistId },
      relations: { owner: true, items: true },
    });

    delete updatedWishlist.owner.password;
    delete updatedWishlist.owner.email;

    return updatedWishlist;
  }

  async removeOne(wishlistId: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id: wishlistId },
      relations: { owner: true, items: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден!');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Удалять чужие вишлисты запрещено!');
    }

    await this.wishlistsRepository.delete(wishlistId);

    return wishlist;
  }
}
