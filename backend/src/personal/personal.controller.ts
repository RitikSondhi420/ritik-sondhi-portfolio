import { Controller, Get, Put, Body } from '@nestjs/common';
import { PersonalService } from './personal.service';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Get()
  async getPersonal() {
    return this.personalService.getPersonal();
  }

  @Put()
  async updatePersonal(@Body() body: any) {
    return this.personalService.updatePersonal(body);
  }
}
