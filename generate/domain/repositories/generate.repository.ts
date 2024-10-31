import { Generate } from '../entities/generate.entity';

export interface GenerateRepository {
  create(data: Generate): Promise<Generate>;
  findById(id: string): Promise<Generate | null>;
  findAll(): Promise<Generate[]>;
  update(id: string, data: Partial<Generate>): Promise<void>;
}