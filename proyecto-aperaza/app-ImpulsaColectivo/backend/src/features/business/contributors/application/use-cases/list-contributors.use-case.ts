import { Inject, Injectable } from '@nestjs/common';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../domain/interfaces/contributor-repository.interface';
import { ContributorFilterDto } from '../dto/contributor-filter.dto';
import { ContributorMapper } from '../mappers/contributor.mapper';

@Injectable()
export class ListContributorsUseCase {
  constructor(
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(filter: ContributorFilterDto) {
    const result = await this.contributorRepository.findAll(filter);
    return {
      items: result.items.map((item) => ContributorMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
