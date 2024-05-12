import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return await this.wishlistsService.findMany();
  }

  @Get(':id')
  async getWishlistsById(@Param('id') id: string) {
    return await this.wishlistsService.findWishlistsById(Number(id));
  }

  @Post()
  async create(@Body() createWishListDto: CreateWishlistDto, @Req() req) {
    return await this.wishlistsService.create(req.user, createWishListDto);
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return await this.wishlistsService.updateOne(
      req.user,
      Number(id),
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.wishlistsService.removeOne(Number(id), req.user.id);
  }
}
