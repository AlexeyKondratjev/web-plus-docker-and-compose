import { IsDate, IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
