import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { CompositeGuard } from './guards/composite.guard';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.TYPEORM_URL,
      entities: [`${__dirname}/**/entities/*.{ts,js}`],
      migrations: [`${__dirname}/**/migration/*.{ts,js}`],
      logging: false,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    AccountModule,
    TransactionModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CompositeGuard,
    },
  ],
})
export class AppModule {}
