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
import { CreatePromoterDto } from '../../../application/dto/create-promoter.dto';
import { UpdatePromoterDto } from '../../../application/dto/update-promoter.dto';
import { PromoterFilterDto } from '../../../application/dto/promoter-filter.dto';
import { PromoterResponseDto } from '../../../application/dto/promoter-response.dto';
import { CreatePromoterUseCase } from '../../../application/use-cases/create-promoter.use-case';
import { UpdatePromoterUseCase } from '../../../application/use-cases/update-promoter.use-case';
import { DeletePromoterUseCase } from '../../../application/use-cases/delete-promoter.use-case';
import { GetPromoterUseCase } from '../../../application/use-cases/get-promoter.use-case';
import { ListPromotersUseCase } from '../../../application/use-cases/list-promoters.use-case';

@ApiTags('Promoters')
@Controller('promoters')
export class PromotersController {
  constructor(
    private readonly createPromoterUseCase: CreatePromoterUseCase,
    private readonly updatePromoterUseCase: UpdatePromoterUseCase,
    private readonly deletePromoterUseCase: DeletePromoterUseCase,
    private readonly getPromoterUseCase: GetPromoterUseCase,
    private readonly listPromotersUseCase: ListPromotersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un promotor' })
  @ApiCreatedResponse({ type: PromoterResponseDto })
  create(@Body() dto: CreatePromoterDto) {
    return this.createPromoterUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar promotores' })
  @ApiOkResponse({ type: [PromoterResponseDto] })
  findAll(@Query() filter: PromoterFilterDto) {
    return this.listPromotersUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un promotor por ID' })
  @ApiOkResponse({ type: PromoterResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getPromoterUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un promotor' })
  @ApiOkResponse({ type: PromoterResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePromoterDto,
  ) {
    return this.updatePromoterUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un promotor' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deletePromoterUseCase.execute(id);
  }
}
