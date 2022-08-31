import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: password is not encrypted
    const user = await this.usersService.authenticate(email, password);

    if (user) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { name: user.name, sub: user.uuid };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
