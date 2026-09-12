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
import { CreateContributionDto } from '../../../application/dto/create-contribution.dto';
import { UpdateContributionDto } from '../../../application/dto/update-contribution.dto';
import { ContributionFilterDto } from '../../../application/dto/contribution-filter.dto';
import { ContributionResponseDto } from '../../../application/dto/contribution-response.dto';
import { CreateContributionUseCase } from '../../../application/use-cases/create-contribution.use-case';
import { UpdateContributionUseCase } from '../../../application/use-cases/update-contribution.use-case';
import { DeleteContributionUseCase } from '../../../application/use-cases/delete-contribution.use-case';
import { GetContributionUseCase } from '../../../application/use-cases/get-contribution.use-case';
import { ListContributionsUseCase } from '../../../application/use-cases/list-contributions.use-case';

@ApiTags('Contributions')
@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly createContributionUseCase: CreateContributionUseCase,
    private readonly updateContributionUseCase: UpdateContributionUseCase,
    private readonly deleteContributionUseCase: DeleteContributionUseCase,
    private readonly getContributionUseCase: GetContributionUseCase,
    private readonly listContributionsUseCase: ListContributionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un aporte' })
  @ApiCreatedResponse({ type: ContributionResponseDto })
  create(@Body() dto: CreateContributionDto) {
    return this.createContributionUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aportes' })
  @ApiOkResponse({ type: [ContributionResponseDto] })
  findAll(@Query() filter: ContributionFilterDto) {
    return this.listContributionsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un aporte por ID' })
  @ApiOkResponse({ type: ContributionResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getContributionUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un aporte' })
  @ApiOkResponse({ type: ContributionResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateContributionDto,
  ) {
    return this.updateContributionUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un aporte' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteContributionUseCase.execute(id);
  }
}
