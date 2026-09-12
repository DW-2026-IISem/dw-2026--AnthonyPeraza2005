import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateContributionDto {
  @ApiProperty({ example: 'Aporte inicial de lanzamiento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Aporte realizado por un aportante a un proyecto' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  contributorId: number;
}
