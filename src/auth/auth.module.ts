import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
    EventsModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard],
  exports: [AuthService,RolesGuard], // to use authservice in other module we have to export the authService and import the authModule where we want to use this authService
})
export class AuthModule {}
