import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";



// protect the route
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){};