import { Module } from '@nestjs/common';
import { GenerateController } from './application/controllers/generate.controller';
import { GenerateService } from './domain/services/generate.domain-service';
import { GenerateTypeormRepository } from './infrastructure/repositories/generate.typeorm.repository';

@Module({
  controllers: [GenerateController],
  providers: [
    GenerateService,
    { provide: 'GenerateRepository', useClass: GenerateTypeormRepository },
  ],
})
export class GenerateModule {}