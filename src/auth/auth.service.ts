import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEventService } from 'src/events/user-event.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private userEventService:UserEventService
  ) {}

  // register the user
  async register(registerData: RegisterDto) {
    const existedUser = await this.usersRepository.findOne({
      where: { email: registerData.email },
    });

    if (existedUser) {
      throw new ConflictException(
        'This email is already taken, use different email!',
      );
    }

    const hashPassword = await this.hashPassword(registerData.password);

    const newUser = {
      name: registerData.name,
      email: registerData.email,
      password: hashPassword,
      role: UserRole.USER,
    };

    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...userData } = savedUser;
     // emit the message to event emitter
    this.userEventService.EmitUserRegistered(savedUser);

    return {
      user: userData,
      message: 'User Register Success',
    };
  }

  // create admin
  async createAdmin(registerData: RegisterDto) {
    const existedUser = await this.usersRepository.findOne({
      where: { email: registerData.email },
    });

    if (existedUser) {
      throw new ConflictException(
        'This email is already taken, use different email!',
      );
    }

    const hashPassword = await this.hashPassword(registerData.password);

    const newUser = {
      name: registerData.name,
      email: registerData.email,
      password: hashPassword,
      role: UserRole.ADMIN,
    };

    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...userData } = savedUser;

    // emit the message to event emitter
    this.userEventService.EmitUserRegistered(savedUser);

    return {
      user: userData,
      message: 'Admin Register Success',
    };
  }

  // login user/admin
  async login(loginData: LoginDto) {
    const existedUser = await this.usersRepository.findOne({
      where: { email: loginData.email },
    });
    if (!existedUser) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const isValidPassword = await this.comparePassword(
      loginData.password,
      existedUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const tokens = await this.generateTokens(existedUser);

    const { password, ...result } = existedUser;
    return {
      message: 'Login Success',
      user: result,
      ...tokens,
    };
  }

  // get user by id

  async userById(id:number){
    const user = await this.usersRepository.findOne({where:{id}})
    if(!user){
        throw new NotFoundException('User not found with this id!')
    }
    const {password,...result} = user;
    return result;
  }

 // refresh token
async refreshToken(refreshToken:string){
    try {
        const decodeToken = await this.jwtService.verify(refreshToken,{secret:process.env.JWT_REFRESH_SECRET})

        const user = await this.usersRepository.findOne({where:{id:decodeToken.sub}});
        if(!user){
            throw new UnauthorizedException('Invalid Token');
        }

      const accessToken = await this.generateAccessToken(user)
     return {accessToken};
        
    } catch (error) {
        throw new UnauthorizedException('Invalid Token')
    }
 }

  // generate tokens
  private async generateTokens(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  // generate access token
  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '20m',
    });
  }

  // generate refresh token
  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };

    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  // compare password
  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // hash password
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
