import { Inject, Injectable } from '@nestjs/common';
import { Contributor } from '../../domain/entities/contributor.entity';
import {
  IContributorRepository,
  CONTRIBUTOR_REPOSITORY,
} from '../../domain/interfaces/contributor-repository.interface';
import { CreateContributorDto } from '../dto/create-contributor.dto';
import { ContributorMapper } from '../mappers/contributor.mapper';

@Injectable()
export class CreateContributorUseCase {
  constructor(
    @Inject(CONTRIBUTOR_REPOSITORY)
    private readonly contributorRepository: IContributorRepository,
  ) {}

  async execute(dto: CreateContributorDto) {
    const contributor = Contributor.create(dto);
    const created = await this.contributorRepository.create(contributor);
    return ContributorMapper.toResponse(created);
  }
}
