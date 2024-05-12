import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  exports: [WishlistsService],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
