import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), HashModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
