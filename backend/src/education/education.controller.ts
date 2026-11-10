import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll() {
    return this.educationService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.educationService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.educationService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.educationService.delete(id);
  }
}
