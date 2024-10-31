import { Repository, DataSource } from 'typeorm';
import { GenerateOrmEntity } from '../entities/generate.orm-entity';
import { GenerateRepository } from '../../domain/repositories/generate.repository';

export class GenerateTypeormRepository implements GenerateRepository {
  private ormRepository: Repository<GenerateOrmEntity>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(GenerateOrmEntity);
  }

  async create(data: GenerateOrmEntity): Promise<GenerateOrmEntity> {
    return await this.ormRepository.save(data);
  }

  async findById(id: string): Promise<GenerateOrmEntity | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<GenerateOrmEntity[]> {
    return await this.ormRepository.find();
  }

  async update(id: string, data: Partial<GenerateOrmEntity>): Promise<void> {
    await this.ormRepository.update(id, data);
  }
}