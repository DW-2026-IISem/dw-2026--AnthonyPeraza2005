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
import { CreateGoalDto } from '../../../application/dto/create-goal.dto';
import { UpdateGoalDto } from '../../../application/dto/update-goal.dto';
import { GoalFilterDto } from '../../../application/dto/goal-filter.dto';
import { GoalResponseDto } from '../../../application/dto/goal-response.dto';
import { CreateGoalUseCase } from '../../../application/use-cases/create-goal.use-case';
import { UpdateGoalUseCase } from '../../../application/use-cases/update-goal.use-case';
import { DeleteGoalUseCase } from '../../../application/use-cases/delete-goal.use-case';
import { GetGoalUseCase } from '../../../application/use-cases/get-goal.use-case';
import { ListGoalsUseCase } from '../../../application/use-cases/list-goals.use-case';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(
    private readonly createGoalUseCase: CreateGoalUseCase,
    private readonly updateGoalUseCase: UpdateGoalUseCase,
    private readonly deleteGoalUseCase: DeleteGoalUseCase,
    private readonly getGoalUseCase: GetGoalUseCase,
    private readonly listGoalsUseCase: ListGoalsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una meta' })
  @ApiCreatedResponse({ type: GoalResponseDto })
  create(@Body() dto: CreateGoalDto) {
    return this.createGoalUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar metas' })
  @ApiOkResponse({ type: [GoalResponseDto] })
  findAll(@Query() filter: GoalFilterDto) {
    return this.listGoalsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una meta por ID' })
  @ApiOkResponse({ type: GoalResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getGoalUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una meta' })
  @ApiOkResponse({ type: GoalResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.updateGoalUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una meta' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteGoalUseCase.execute(id);
  }
}
