import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get(':id')
  async getWishById(@Param('id') id: string) {
    return await this.wishesService.findOne(Number(id));
  }

  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }

  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(
      Number(id),
      updateWishDto,
      req.user.id,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.wishesService.removeOne(id, req.user.id);
  }
}
