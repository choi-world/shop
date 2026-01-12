import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

// 현재는 redis module로 관리하고 있지 않기 때문에 차후 전역으로 필요하면 redis module 생성 후 의존성 주입 필요
@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  del(key: string) {
    return this.client.del(key);
  }
}
