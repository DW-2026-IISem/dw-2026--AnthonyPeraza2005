import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe';
import { CreatePaymentTransactionDto } from '../../../application/dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from '../../../application/dto/update-payment-transaction.dto';
import { PaymentTransactionFilterDto } from '../../../application/dto/payment-transaction-filter.dto';
import { PaymentTransactionResponseDto } from '../../../application/dto/payment-transaction-response.dto';
import { CreatePaymentTransactionUseCase } from '../../../application/use-cases/create-payment-transaction.use-case';
import { UpdatePaymentTransactionUseCase } from '../../../application/use-cases/update-payment-transaction.use-case';
import { DeletePaymentTransactionUseCase } from '../../../application/use-cases/delete-payment-transaction.use-case';
import { GetPaymentTransactionUseCase } from '../../../application/use-cases/get-payment-transaction.use-case';
import { ListPaymentTransactionsUseCase } from '../../../application/use-cases/list-payment-transactions.use-case';

@ApiTags('Payment Transactions')
@Controller('payment-transactions')
export class PaymentTransactionsController {
  constructor(
    private readonly createPaymentTransactionUseCase: CreatePaymentTransactionUseCase,
    private readonly updatePaymentTransactionUseCase: UpdatePaymentTransactionUseCase,
    private readonly deletePaymentTransactionUseCase: DeletePaymentTransactionUseCase,
    private readonly getPaymentTransactionUseCase: GetPaymentTransactionUseCase,
    private readonly listPaymentTransactionsUseCase: ListPaymentTransactionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una transacción de pago' })
  @ApiCreatedResponse({ type: PaymentTransactionResponseDto })
  create(@Body() dto: CreatePaymentTransactionDto) {
    return this.createPaymentTransactionUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transacciones de pago' })
  @ApiOkResponse({ type: [PaymentTransactionResponseDto] })
  findAll(@Query() filter: PaymentTransactionFilterDto) {
    return this.listPaymentTransactionsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción de pago por ID' })
  @ApiOkResponse({ type: PaymentTransactionResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getPaymentTransactionUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una transacción de pago' })
  @ApiOkResponse({ type: PaymentTransactionResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePaymentTransactionDto,
  ) {
    return this.updatePaymentTransactionUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una transacción de pago' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deletePaymentTransactionUseCase.execute(id);
  }
}
