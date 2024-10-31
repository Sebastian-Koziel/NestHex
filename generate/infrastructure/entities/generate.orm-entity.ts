import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('generates')
export class GenerateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}