import { SetMetadata } from '@nestjs/common';
export const jwtConstants = {
  secret: '9032731c-0bb0-4371-a547-9b8aaeb587f3',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
