import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './guards/local-aut.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

interface IUserRequest extends Request {
  user: User;
}

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: IUserRequest) {
    return await this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    this.authService.auth(user);

    delete user.password;

    return user;
  }
}
