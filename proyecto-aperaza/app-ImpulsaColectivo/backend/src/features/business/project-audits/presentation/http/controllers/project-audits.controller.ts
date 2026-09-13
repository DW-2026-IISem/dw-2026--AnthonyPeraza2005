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
import { CreateProjectAuditDto } from '../../../application/dto/create-project-audit.dto';
import { UpdateProjectAuditDto } from '../../../application/dto/update-project-audit.dto';
import { ProjectAuditFilterDto } from '../../../application/dto/project-audit-filter.dto';
import { ProjectAuditResponseDto } from '../../../application/dto/project-audit-response.dto';
import { CreateProjectAuditUseCase } from '../../../application/use-cases/create-project-audit.use-case';
import { UpdateProjectAuditUseCase } from '../../../application/use-cases/update-project-audit.use-case';
import { DeleteProjectAuditUseCase } from '../../../application/use-cases/delete-project-audit.use-case';
import { GetProjectAuditUseCase } from '../../../application/use-cases/get-project-audit.use-case';
import { ListProjectAuditsUseCase } from '../../../application/use-cases/list-project-audits.use-case';

@ApiTags('Project Audits')
@Controller('project-audits')
export class ProjectAuditsController {
  constructor(
    private readonly createProjectAuditUseCase: CreateProjectAuditUseCase,
    private readonly updateProjectAuditUseCase: UpdateProjectAuditUseCase,
    private readonly deleteProjectAuditUseCase: DeleteProjectAuditUseCase,
    private readonly getProjectAuditUseCase: GetProjectAuditUseCase,
    private readonly listProjectAuditsUseCase: ListProjectAuditsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una auditoría de proyecto' })
  @ApiCreatedResponse({ type: ProjectAuditResponseDto })
  create(@Body() dto: CreateProjectAuditDto) {
    return this.createProjectAuditUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar auditorías de proyecto' })
  @ApiOkResponse({ type: [ProjectAuditResponseDto] })
  findAll(@Query() filter: ProjectAuditFilterDto) {
    return this.listProjectAuditsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una auditoría de proyecto por ID' })
  @ApiOkResponse({ type: ProjectAuditResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getProjectAuditUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una auditoría de proyecto' })
  @ApiOkResponse({ type: ProjectAuditResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateProjectAuditDto,
  ) {
    return this.updateProjectAuditUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una auditoría de proyecto' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteProjectAuditUseCase.execute(id);
  }
}
