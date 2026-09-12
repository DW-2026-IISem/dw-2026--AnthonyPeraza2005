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
import { CreateCommissionDto } from '../../../application/dto/create-commission.dto';
import { UpdateCommissionDto } from '../../../application/dto/update-commission.dto';
import { CommissionFilterDto } from '../../../application/dto/commission-filter.dto';
import { CommissionResponseDto } from '../../../application/dto/commission-response.dto';
import { CreateCommissionUseCase } from '../../../application/use-cases/create-commission.use-case';
import { UpdateCommissionUseCase } from '../../../application/use-cases/update-commission.use-case';
import { DeleteCommissionUseCase } from '../../../application/use-cases/delete-commission.use-case';
import { GetCommissionUseCase } from '../../../application/use-cases/get-commission.use-case';
import { ListCommissionsUseCase } from '../../../application/use-cases/list-commissions.use-case';

@ApiTags('Commissions')
@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly createCommissionUseCase: CreateCommissionUseCase,
    private readonly updateCommissionUseCase: UpdateCommissionUseCase,
    private readonly deleteCommissionUseCase: DeleteCommissionUseCase,
    private readonly getCommissionUseCase: GetCommissionUseCase,
    private readonly listCommissionsUseCase: ListCommissionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una comisión' })
  @ApiCreatedResponse({ type: CommissionResponseDto })
  create(@Body() dto: CreateCommissionDto) {
    return this.createCommissionUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar comisiones' })
  @ApiOkResponse({ type: [CommissionResponseDto] })
  findAll(@Query() filter: CommissionFilterDto) {
    return this.listCommissionsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una comisión por ID' })
  @ApiOkResponse({ type: CommissionResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getCommissionUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una comisión' })
  @ApiOkResponse({ type: CommissionResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateCommissionDto,
  ) {
    return this.updateCommissionUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una comisión' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteCommissionUseCase.execute(id);
  }
}
