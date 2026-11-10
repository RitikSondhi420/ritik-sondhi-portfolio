import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ExperienceService } from './experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAll() {
    return this.experienceService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.experienceService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.experienceService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.experienceService.delete(id);
  }
}
