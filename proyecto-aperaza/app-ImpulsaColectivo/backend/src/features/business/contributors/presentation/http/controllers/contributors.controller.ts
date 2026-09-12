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
import { CreateContributorDto } from '../../../application/dto/create-contributor.dto';
import { UpdateContributorDto } from '../../../application/dto/update-contributor.dto';
import { ContributorFilterDto } from '../../../application/dto/contributor-filter.dto';
import { ContributorResponseDto } from '../../../application/dto/contributor-response.dto';
import { CreateContributorUseCase } from '../../../application/use-cases/create-contributor.use-case';
import { UpdateContributorUseCase } from '../../../application/use-cases/update-contributor.use-case';
import { DeleteContributorUseCase } from '../../../application/use-cases/delete-contributor.use-case';
import { GetContributorUseCase } from '../../../application/use-cases/get-contributor.use-case';
import { ListContributorsUseCase } from '../../../application/use-cases/list-contributors.use-case';

@ApiTags('Contributors')
@Controller('contributors')
export class ContributorsController {
  constructor(
    private readonly createContributorUseCase: CreateContributorUseCase,
    private readonly updateContributorUseCase: UpdateContributorUseCase,
    private readonly deleteContributorUseCase: DeleteContributorUseCase,
    private readonly getContributorUseCase: GetContributorUseCase,
    private readonly listContributorsUseCase: ListContributorsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un aportante' })
  @ApiCreatedResponse({ type: ContributorResponseDto })
  create(@Body() dto: CreateContributorDto) {
    return this.createContributorUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aportantes' })
  @ApiOkResponse({ type: [ContributorResponseDto] })
  findAll(@Query() filter: ContributorFilterDto) {
    return this.listContributorsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un aportante por ID' })
  @ApiOkResponse({ type: ContributorResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getContributorUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un aportante' })
  @ApiOkResponse({ type: ContributorResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateContributorDto,
  ) {
    return this.updateContributorUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un aportante' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteContributorUseCase.execute(id);
  }
}
