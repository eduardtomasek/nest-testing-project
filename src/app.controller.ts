import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginEntity } from './serializers/login.serializer';
import { GeneralResponseEntity } from './serializers/response-wrapper.serializer';
import { JwtUser } from './types/jwt-user.type';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    const loginObject = await this.authService.login(req.user);

    return new GeneralResponseEntity({
      data: new LoginEntity(loginObject),
      meta: {},
    });
  }

  @Post('register')
  register(): any {
    return {};
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('test')
  // test(@Request() req): any {
  //   const user: JwtUser = req.user;
  //   return user;
  // }
}
