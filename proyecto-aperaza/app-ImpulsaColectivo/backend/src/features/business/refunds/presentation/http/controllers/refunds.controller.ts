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
import { CreateRefundDto } from '../../../application/dto/create-refund.dto';
import { UpdateRefundDto } from '../../../application/dto/update-refund.dto';
import { RefundFilterDto } from '../../../application/dto/refund-filter.dto';
import { RefundResponseDto } from '../../../application/dto/refund-response.dto';
import { CreateRefundUseCase } from '../../../application/use-cases/create-refund.use-case';
import { UpdateRefundUseCase } from '../../../application/use-cases/update-refund.use-case';
import { DeleteRefundUseCase } from '../../../application/use-cases/delete-refund.use-case';
import { GetRefundUseCase } from '../../../application/use-cases/get-refund.use-case';
import { ListRefundsUseCase } from '../../../application/use-cases/list-refunds.use-case';

@ApiTags('Refunds')
@Controller('refunds')
export class RefundsController {
  constructor(
    private readonly createRefundUseCase: CreateRefundUseCase,
    private readonly updateRefundUseCase: UpdateRefundUseCase,
    private readonly deleteRefundUseCase: DeleteRefundUseCase,
    private readonly getRefundUseCase: GetRefundUseCase,
    private readonly listRefundsUseCase: ListRefundsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una devolución' })
  @ApiCreatedResponse({ type: RefundResponseDto })
  create(@Body() dto: CreateRefundDto) {
    return this.createRefundUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar devoluciones' })
  @ApiOkResponse({ type: [RefundResponseDto] })
  findAll(@Query() filter: RefundFilterDto) {
    return this.listRefundsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una devolución por ID' })
  @ApiOkResponse({ type: RefundResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getRefundUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una devolución' })
  @ApiOkResponse({ type: RefundResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRefundDto,
  ) {
    return this.updateRefundUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una devolución' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteRefundUseCase.execute(id);
  }
}
