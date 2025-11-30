import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
