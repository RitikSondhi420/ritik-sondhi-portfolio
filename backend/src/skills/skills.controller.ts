import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  async addSkill(@Body() body: { category: string; name: string; level: number; featured?: boolean }) {
    return this.skillsService.addSkill(body);
  }

  @Delete()
  async deleteSkill(@Query('category') category: string, @Query('name') name: string) {
    return this.skillsService.deleteSkill(category, name);
  }
}
