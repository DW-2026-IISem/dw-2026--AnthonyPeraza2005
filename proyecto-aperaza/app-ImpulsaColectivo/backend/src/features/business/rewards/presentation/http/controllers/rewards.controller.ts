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
import { CreateRewardDto } from '../../../application/dto/create-reward.dto';
import { UpdateRewardDto } from '../../../application/dto/update-reward.dto';
import { RewardFilterDto } from '../../../application/dto/reward-filter.dto';
import { RewardResponseDto } from '../../../application/dto/reward-response.dto';
import { CreateRewardUseCase } from '../../../application/use-cases/create-reward.use-case';
import { UpdateRewardUseCase } from '../../../application/use-cases/update-reward.use-case';
import { DeleteRewardUseCase } from '../../../application/use-cases/delete-reward.use-case';
import { GetRewardUseCase } from '../../../application/use-cases/get-reward.use-case';
import { ListRewardsUseCase } from '../../../application/use-cases/list-rewards.use-case';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(
    private readonly createRewardUseCase: CreateRewardUseCase,
    private readonly updateRewardUseCase: UpdateRewardUseCase,
    private readonly deleteRewardUseCase: DeleteRewardUseCase,
    private readonly getRewardUseCase: GetRewardUseCase,
    private readonly listRewardsUseCase: ListRewardsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una recompensa' })
  @ApiCreatedResponse({ type: RewardResponseDto })
  create(@Body() dto: CreateRewardDto) {
    return this.createRewardUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar recompensas' })
  @ApiOkResponse({ type: [RewardResponseDto] })
  findAll(@Query() filter: RewardFilterDto) {
    return this.listRewardsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una recompensa por ID' })
  @ApiOkResponse({ type: RewardResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getRewardUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una recompensa' })
  @ApiOkResponse({ type: RewardResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRewardDto,
  ) {
    return this.updateRewardUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una recompensa' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteRewardUseCase.execute(id);
  }
}
