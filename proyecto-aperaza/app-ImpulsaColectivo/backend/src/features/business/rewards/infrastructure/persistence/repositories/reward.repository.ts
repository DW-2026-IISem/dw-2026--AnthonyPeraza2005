import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Reward } from '../../../domain/entities/reward.entity';
import {
  IRewardRepository,
  RewardFindAllParams,
} from '../../../domain/interfaces/reward-repository.interface';
import { RewardMapper } from '../../../application/mappers/reward.mapper';
import { RewardModel } from '../models/reward.model';

@Injectable()
export class RewardRepository implements IRewardRepository {
  async create(reward: Reward): Promise<Reward> {
    const model = await RewardModel.create(RewardMapper.toPersistence(reward));
    return RewardMapper.toDomain(model);
  }

  async update(reward: Reward): Promise<Reward> {
    await RewardModel.update(RewardMapper.toPersistence(reward), {
      where: { id: reward.id },
    });
    const updated = await RewardModel.findByPk(reward.id!);
    return RewardMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await RewardModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Reward | null> {
    const model = await RewardModel.findByPk(id);
    return model ? RewardMapper.toDomain(model) : null;
  }

  async findAll(params: RewardFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: WhereOptions = {};

    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.like]: `%${params.search}%` } },
          { description: { [Op.like]: `%${params.search}%` } },
        ],
      });
    }

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    const { rows, count } = await RewardModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => RewardMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
