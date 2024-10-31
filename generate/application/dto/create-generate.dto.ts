import { IsUUID } from 'class-validator';

export class CreateGenerateDto {
  @IsUUID()
  id: string;
}