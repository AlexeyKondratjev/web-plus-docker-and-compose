import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден!');
    }

    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя скинуться на собственный подарок!');
    }

    const totalSum = Number(wish.raised) + Number(createOfferDto.amount);

    if (totalSum > wish.price) {
      throw new ForbiddenException(
        'Сумма заявки превышает необходимый остаток!',
      );
    }

    const newOffer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    delete newOffer.user.password;
    delete newOffer.user.email;
    delete newOffer.item.owner.password;
    delete newOffer.item.owner.email;

    if (!newOffer.hidden) {
      delete newOffer.user.username;
    }

    await this.wishesService.updateRaisedSum(wish.id, totalSum);

    return await this.offersRepository.save(newOffer);
  }

  async findMany() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });

    if (offers.length === 0) {
      throw new NotFoundException('Предложений скинуться не найдено!');
    }

    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });

    if (offer.length === 0) {
      throw new NotFoundException('Такого предложения скинуться не найдено!');
    }

    return offer;
  }
}
