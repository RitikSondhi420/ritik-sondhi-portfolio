import { Controller, Get, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getPortfolio() {
    return this.portfolioService.getPortfolioData();
  }

  @Post('reset')
  async resetPortfolio() {
    return this.portfolioService.resetPortfolioData();
  }
}
