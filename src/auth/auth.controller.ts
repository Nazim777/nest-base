import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserData: RegisterDto) {
    return this.authService.register(registerUserData);
  }

  @Post('login')
  async login(@Body() loginUserData: LoginDto) {
    return this.authService.login(loginUserData);
  }

  @Post('/refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshToken(refreshToken);
  }

  // current user
  // protected route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getCurrentUser(@CurrentUser() user: any) {
    return user;
  }

  // protected route
  // admin can access
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-admin')
  async createAdmin(@Body() createAdminData: RegisterDto) {
    return await this.authService.createAdmin(createAdminData);
  }
}
