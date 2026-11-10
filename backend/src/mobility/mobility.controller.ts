import { Controller, Get, Put, Body } from '@nestjs/common';
import { MobilityService } from './mobility.service';

@Controller('mobility')
export class MobilityController {
  constructor(private readonly mobilityService: MobilityService) {}

  @Get()
  async getMobility() {
    return this.mobilityService.getMobility();
  }

  @Put()
  async updateMobility(@Body() body: any) {
    return this.mobilityService.updateMobility(body);
  }
}
