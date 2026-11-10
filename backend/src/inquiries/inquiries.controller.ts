import { Controller, Post, Get, Body } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() body: { name: string; email: string; company?: string; message: string }) {
    return this.inquiriesService.create(body);
  }

  @Get()
  async findAll() {
    return this.inquiriesService.findAll();
  }
}
