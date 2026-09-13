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
import { CreateDisbursementDto } from '../../../application/dto/create-disbursement.dto';
import { UpdateDisbursementDto } from '../../../application/dto/update-disbursement.dto';
import { DisbursementFilterDto } from '../../../application/dto/disbursement-filter.dto';
import { DisbursementResponseDto } from '../../../application/dto/disbursement-response.dto';
import { CreateDisbursementUseCase } from '../../../application/use-cases/create-disbursement.use-case';
import { UpdateDisbursementUseCase } from '../../../application/use-cases/update-disbursement.use-case';
import { DeleteDisbursementUseCase } from '../../../application/use-cases/delete-disbursement.use-case';
import { GetDisbursementUseCase } from '../../../application/use-cases/get-disbursement.use-case';
import { ListDisbursementsUseCase } from '../../../application/use-cases/list-disbursements.use-case';

@ApiTags('Disbursements')
@Controller('disbursements')
export class DisbursementsController {
  constructor(
    private readonly createDisbursementUseCase: CreateDisbursementUseCase,
    private readonly updateDisbursementUseCase: UpdateDisbursementUseCase,
    private readonly deleteDisbursementUseCase: DeleteDisbursementUseCase,
    private readonly getDisbursementUseCase: GetDisbursementUseCase,
    private readonly listDisbursementsUseCase: ListDisbursementsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un desembolso' })
  @ApiCreatedResponse({ type: DisbursementResponseDto })
  create(@Body() dto: CreateDisbursementDto) {
    return this.createDisbursementUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar desembolsos' })
  @ApiOkResponse({ type: [DisbursementResponseDto] })
  findAll(@Query() filter: DisbursementFilterDto) {
    return this.listDisbursementsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un desembolso por ID' })
  @ApiOkResponse({ type: DisbursementResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getDisbursementUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un desembolso' })
  @ApiOkResponse({ type: DisbursementResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateDisbursementDto,
  ) {
    return this.updateDisbursementUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un desembolso' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteDisbursementUseCase.execute(id);
  }
}
