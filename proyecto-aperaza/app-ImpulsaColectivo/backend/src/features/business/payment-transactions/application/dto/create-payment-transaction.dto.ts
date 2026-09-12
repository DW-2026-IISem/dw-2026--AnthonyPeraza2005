import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export class CreatePaymentTransactionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  referenceId: number;

  @ApiProperty({ example: '2026-09-11T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ enum: TransactionStatus, example: TransactionStatus.PENDIENTE })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({ example: 'Pago confirmado por pasarela' })
  @IsOptional()
  @IsString()
  notes?: string;
}
