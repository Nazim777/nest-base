import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_ACCESS_SECRET}`,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.userById(payload.sub);
      return {
        id:user.id,
        name:user.name,
        email:user.email,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
