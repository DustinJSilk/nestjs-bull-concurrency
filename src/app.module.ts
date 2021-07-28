import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ColoursConsumer } from './consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    BullModule.registerQueue({
      name: 'colours',
    }),
  ],
  providers: [ColoursConsumer],
})
export class AppModule {}
