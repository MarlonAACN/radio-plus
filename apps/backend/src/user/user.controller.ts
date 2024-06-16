import { Controller, Get, HttpException, Req, Res } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';
import { RadioPlus } from '@/types/RadioPlus';
import { Response } from '@/types/Better-express';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(
    @Req() request: AuthRequest,
    @Res({ passthrough: true }) response: Response
  ): Promise<RadioPlus.User> {
    return this.userService
      .getUser(request.accessToken, response)
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

  @Get('data')
  getUserData(@Req() request: AuthRequest): Promise<RadioPlus.UserData> {
    return this.userService
      .getUserData(request.accessToken)
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
