import { Module } from '@nestjs/common';
import { db } from './kysely';

@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
