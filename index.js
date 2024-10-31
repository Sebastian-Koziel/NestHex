#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const templates = {
    module: (moduleName) => `
import { Module } from '@nestjs/common';
import { ${capitalize(moduleName)}Controller } from './application/controllers/${moduleName}.controller';
import { ${capitalize(moduleName)}Service } from './domain/services/${moduleName}.domain-service';
import { ${capitalize(moduleName)}TypeormRepository } from './infrastructure/repositories/${moduleName}.typeorm.repository';

@Module({
  controllers: [${capitalize(moduleName)}Controller],
  providers: [
    ${capitalize(moduleName)}Service,
    { provide: '${capitalize(moduleName)}Repository', useClass: ${capitalize(moduleName)}TypeormRepository },
  ],
})
export class ${capitalize(moduleName)}Module {}
`,

    controller: (moduleName) => `
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Create${capitalize(moduleName)}Dto } from '../dto/create-${moduleName}.dto';
import { Update${capitalize(moduleName)}Dto } from '../dto/update-${moduleName}.dto';
import { ${capitalize(moduleName)}Service } from '../../domain/services/${moduleName}.domain-service';

@Controller('${moduleName}s')
export class ${capitalize(moduleName)}Controller {
  constructor(private readonly ${moduleName}Service: ${capitalize(moduleName)}Service) {}

  @Post()
  create(@Body() createDto: Create${capitalize(moduleName)}Dto) {
    return this.${moduleName}Service.create(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${moduleName}Service.findById(id);
  }

  @Get()
  findAll() {
    return this.${moduleName}Service.findAll();
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateDto: Update${capitalize(moduleName)}Dto) {
    return this.${moduleName}Service.update(id, updateDto);
  }
}
`,

    entity: (moduleName) => `
export class ${capitalize(moduleName)} {
  constructor(public readonly id: string) {}
}
`,

    ormEntity: (moduleName) => `
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${moduleName}s')
export class ${capitalize(moduleName)}OrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
`,

    repository: (moduleName) => `
import { ${capitalize(moduleName)} } from '../entities/${moduleName}.entity';

export interface ${capitalize(moduleName)}Repository {
  create(data: ${capitalize(moduleName)}): Promise<${capitalize(moduleName)}>;
  findById(id: string): Promise<${capitalize(moduleName)} | null>;
  findAll(): Promise<${capitalize(moduleName)}[]>;
  update(id: string, data: Partial<${capitalize(moduleName)}>): Promise<void>;
}
`,

    typeormRepository: (moduleName) => `
import { Repository, DataSource } from 'typeorm';
import { ${capitalize(moduleName)}OrmEntity } from '../entities/${moduleName}.orm-entity';
import { ${capitalize(moduleName)}Repository } from '../../domain/repositories/${moduleName}.repository';

export class ${capitalize(moduleName)}TypeormRepository implements ${capitalize(moduleName)}Repository {
  private ormRepository: Repository<${capitalize(moduleName)}OrmEntity>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(${capitalize(moduleName)}OrmEntity);
  }

  async create(data: ${capitalize(moduleName)}OrmEntity): Promise<${capitalize(moduleName)}OrmEntity> {
    return await this.ormRepository.save(data);
  }

  async findById(id: string): Promise<${capitalize(moduleName)}OrmEntity | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<${capitalize(moduleName)}OrmEntity[]> {
    return await this.ormRepository.find();
  }

  async update(id: string, data: Partial<${capitalize(moduleName)}OrmEntity>): Promise<void> {
    await this.ormRepository.update(id, data);
  }
}
`,

    dto: (moduleName, dtoType) => `
import { IsUUID } from 'class-validator';

export class ${dtoType}${capitalize(moduleName)}Dto {
  @IsUUID()
  id: string;
}
`
};

// Pomocnicza funkcja do kapitalizacji
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Funkcja tworząca strukturę
function createFileStructure(baseDir, moduleName) {
    const structure = [
        { path: `${moduleName}/application/use-cases/create-${moduleName}.use-case.ts`, content: '' },
        { path: `${moduleName}/application/use-cases/find-${moduleName}.use-case.ts`, content: '' },
        { path: `${moduleName}/application/controllers/${moduleName}.controller.ts`, content: templates.controller(moduleName) },
        { path: `${moduleName}/domain/entities/${moduleName}.entity.ts`, content: templates.entity(moduleName) },
        { path: `${moduleName}/domain/repositories/${moduleName}.repository.ts`, content: templates.repository(moduleName) },
        { path: `${moduleName}/domain/services/${moduleName}.domain-service.ts`, content: '' },
        { path: `${moduleName}/infrastructure/entities/${moduleName}.orm-entity.ts`, content: templates.ormEntity(moduleName) },
        { path: `${moduleName}/infrastructure/repositories/${moduleName}.typeorm.repository.ts`, content: templates.typeormRepository(moduleName) },
        { path: `${moduleName}/application/dto/create-${moduleName}.dto.ts`, content: templates.dto(moduleName, 'Create') },
        { path: `${moduleName}/application/dto/update-${moduleName}.dto.ts`, content: templates.dto(moduleName, 'Update') },
        { path: `${moduleName}/${moduleName}.module.ts`, content: templates.module(moduleName) }
    ];

    structure.forEach(({ path: filePath, content }) => {
        const fullPath = path.join(baseDir, filePath);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, content.trim());
        console.log(`Utworzono: ${fullPath}`);
    });
}

// Przykład użycia
const moduleName = process.argv[2];
if (!moduleName) {
    console.error('Podaj nazwę modułu jako argument, np. NestHex generate module logisticUnits');
    process.exit(1);
}

createFileStructure(__dirname, moduleName);
