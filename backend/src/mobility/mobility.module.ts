import { Module } from '@nestjs/common';
import { MobilityService } from './mobility.service';
import { MobilityController } from './mobility.controller';

@Module({
  controllers: [MobilityController],
  providers: [MobilityService],
  exports: [MobilityService],
})
export class MobilityModule {}
