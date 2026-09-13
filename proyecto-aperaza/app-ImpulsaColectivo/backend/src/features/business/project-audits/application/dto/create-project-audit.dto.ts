import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateProjectAuditDto {
  @ApiProperty({ example: 'Revisión de cambios post-lanzamiento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Registro de auditoría de cambios del proyecto' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId: number;
}
