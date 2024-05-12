import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async updateOne(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    delete user.password;
    delete user.email;

    return user;
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.getUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.getUserByName(username);
    return this.usersService.getUserWishes(user.id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('find')
  async findMany(@Body() findUserDto: FindUsersDto) {
    return await this.usersService.findMany(findUserDto);
  }
}
