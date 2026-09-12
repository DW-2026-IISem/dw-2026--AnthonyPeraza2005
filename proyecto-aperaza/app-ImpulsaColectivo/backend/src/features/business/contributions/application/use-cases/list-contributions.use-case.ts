import { Inject, Injectable } from '@nestjs/common';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../domain/interfaces/contribution-repository.interface';
import { ContributionFilterDto } from '../dto/contribution-filter.dto';
import { ContributionMapper } from '../mappers/contribution.mapper';

@Injectable()
export class ListContributionsUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(filter: ContributionFilterDto) {
    const result = await this.contributionRepository.findAll(filter);
    return {
      items: result.items.map((item) => ContributionMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
