// src/common/decorators/user-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // req.user viene de JwtStrategy.validate()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user?.userId as string;
  },
);
