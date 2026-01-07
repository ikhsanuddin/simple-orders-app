import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User, UserSchema } from '@/database/mongo/schemas/user.schema';
import { UserRepository } from '@/database/mongo/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard, UserRepository],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
