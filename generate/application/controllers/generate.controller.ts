import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateGenerateDto } from '../dto/create-generate.dto';
import { UpdateGenerateDto } from '../dto/update-generate.dto';
import { GenerateService } from '../../domain/services/generate.domain-service';

@Controller('generates')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  create(@Body() createDto: CreateGenerateDto) {
    return this.generateService.create(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generateService.findById(id);
  }

  @Get()
  findAll() {
    return this.generateService.findAll();
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateGenerateDto) {
    return this.generateService.update(id, updateDto);
  }
}