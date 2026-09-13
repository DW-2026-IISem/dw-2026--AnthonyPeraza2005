import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export class RefundResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  referenceId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ example: 'Meta no alcanzada antes de la fecha límite' })
  reason: string;

  @ApiProperty({ example: 50000 })
  total: number;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.PENDIENTE })
  status: TransactionStatus;
}
