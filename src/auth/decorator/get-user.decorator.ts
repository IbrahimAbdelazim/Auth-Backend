import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserType } from 'src/user/user.schema';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): UserType | string | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (data) {
      const user = request.user as UserType | string | undefined;
      return user?.[data] as UserType | string | undefined;
    }
    return request.user as UserType | string | undefined;
  },
);
