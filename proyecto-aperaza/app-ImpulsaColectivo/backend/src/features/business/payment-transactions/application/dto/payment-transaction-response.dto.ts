import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export class PaymentTransactionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  referenceId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ example: 50000 })
  amount: number;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.PENDIENTE })
  status: TransactionStatus;

  @ApiPropertyOptional({ example: 'Pago confirmado por pasarela' })
  notes?: string;
}
