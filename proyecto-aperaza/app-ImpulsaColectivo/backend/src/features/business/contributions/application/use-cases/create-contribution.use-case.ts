import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { ContributorNotFoundException } from '../../../contributors/domain/exceptions/contributor-not-found.exception';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../../contributors/domain/interfaces/contributor-repository.interface';
import { Contribution } from '../../domain/entities/contribution.entity';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../domain/interfaces/contribution-repository.interface';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { ContributionMapper } from '../mappers/contribution.mapper';

@Injectable()
export class CreateContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(dto: CreateContributionDto) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException(dto.projectId);
    }

    const contributor = await this.contributorRepository.findById(dto.contributorId);
    if (!contributor) {
      throw new ContributorNotFoundException(dto.contributorId);
    }

    const contribution = Contribution.create(dto);
    const created = await this.contributionRepository.create(contribution);
    return ContributionMapper.toResponse(created);
  }
}
