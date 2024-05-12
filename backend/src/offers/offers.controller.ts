import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(req.user, createOfferDto);
  }

  @Get()
  async findAll() {
    return await this.offersService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(Number(id));
  }
}
