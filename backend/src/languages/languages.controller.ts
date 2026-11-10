import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  async findAll() {
    return this.languagesService.findAll();
  }

  @Post()
  async addLanguage(@Body() body: { name: string; proficiency: string }) {
    return this.languagesService.addLanguage(body);
  }

  @Delete(':name')
  async deleteLanguage(@Param('name') name: string) {
    return this.languagesService.deleteLanguage(name);
  }
}
