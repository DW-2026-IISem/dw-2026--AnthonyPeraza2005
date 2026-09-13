import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectAuditDto } from './create-project-audit.dto';

export class UpdateProjectAuditDto extends PartialType(CreateProjectAuditDto) {}
