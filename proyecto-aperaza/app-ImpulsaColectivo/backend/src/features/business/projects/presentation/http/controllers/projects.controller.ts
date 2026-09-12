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
import { CreateProjectDto } from '../../../application/dto/create-project.dto';
import { UpdateProjectDto } from '../../../application/dto/update-project.dto';
import { ProjectFilterDto } from '../../../application/dto/project-filter.dto';
import { ProjectResponseDto } from '../../../application/dto/project-response.dto';
import { CreateProjectUseCase } from '../../../application/use-cases/create-project.use-case';
import { UpdateProjectUseCase } from '../../../application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from '../../../application/use-cases/delete-project.use-case';
import { GetProjectUseCase } from '../../../application/use-cases/get-project.use-case';
import { ListProjectsUseCase } from '../../../application/use-cases/list-projects.use-case';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly listProjectsUseCase: ListProjectsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un proyecto' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  create(@Body() dto: CreateProjectDto) {
    return this.createProjectUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar proyectos' })
  @ApiOkResponse({ type: [ProjectResponseDto] })
  findAll(@Query() filter: ProjectFilterDto) {
    return this.listProjectsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiOkResponse({ type: ProjectResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getProjectUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiOkResponse({ type: ProjectResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.updateProjectUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteProjectUseCase.execute(id);
  }
}
