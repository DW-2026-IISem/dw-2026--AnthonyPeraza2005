import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContributorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Laura Gómez' })
  name: string;

  @ApiPropertyOptional({ example: 'Persona que realiza aportes a proyectos' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
