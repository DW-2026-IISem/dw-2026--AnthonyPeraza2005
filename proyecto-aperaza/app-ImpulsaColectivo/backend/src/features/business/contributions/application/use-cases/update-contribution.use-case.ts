import { Inject, Injectable } from '@nestjs/common';
import { ContributionNotFoundException } from '../../domain/exceptions/contribution-not-found.exception';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../domain/interfaces/contribution-repository.interface';
import { UpdateContributionDto } from '../dto/update-contribution.dto';
import { ContributionMapper } from '../mappers/contribution.mapper';

@Injectable()
export class UpdateContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(id: number, dto: UpdateContributionDto) {
    const contribution = await this.contributionRepository.findById(id);
    if (!contribution) {
      throw new ContributionNotFoundException(id);
    }

    contribution.update(dto);
    const updated = await this.contributionRepository.update(contribution);
    return ContributionMapper.toResponse(updated);
  }
}
