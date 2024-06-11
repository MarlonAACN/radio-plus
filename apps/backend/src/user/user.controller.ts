import { Controller, Get, HttpException, Req } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('market')
  getUserMarket(@Req() request: AuthRequest): Promise<{ market: string }> {
    return this.userService
      .getUserMarket(request.accessToken)
      .then((userData) => {
        return userData;
      })
      .catch((err: RequestError) => {
        throw new HttpException(
          {
            status: err.status,
            message: err.message,
          },
          err.status
        );
      });
  }
}
