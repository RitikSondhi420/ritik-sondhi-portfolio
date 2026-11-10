import { Module } from '@nestjs/common';
import { ArchitectureService } from './architecture.service';
import { ArchitectureController } from './architecture.controller';

@Module({
  controllers: [ArchitectureController],
  providers: [ArchitectureService],
  exports: [ArchitectureService],
})
export class ArchitectureModule {}
