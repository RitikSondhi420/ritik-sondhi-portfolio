import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ArchitectureService } from './architecture.service';

@Controller('architecture')
export class ArchitectureController {
  constructor(private readonly architectureService: ArchitectureService) {}

  @Get()
  async findAll() {
    return this.architectureService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.architectureService.update(id, body);
  }
}
