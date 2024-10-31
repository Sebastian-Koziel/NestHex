import { IsUUID } from 'class-validator';

export class UpdateGenerateDto {
  @IsUUID()
  id: string;
}