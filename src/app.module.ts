import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { UsersModule } from './shop/users/users.module';
import { AuthModule } from './shop/auth/auth.module';
import { ProductsModule } from './shop/products/products.module';
import { OrdersModule } from './shop/orders/orders.module';
import { AccountModule } from './shop/account/account.module';
import { HealthController } from './shop/health/health.controller';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    AccountModule,
  ],
  controllers: [HealthController], // 헬스 체크는 모듈로 관리하지 않음.
})
export class AppModule {}
