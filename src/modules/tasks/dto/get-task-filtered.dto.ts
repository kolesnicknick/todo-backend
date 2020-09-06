import { TaskStatus } from '../task.model';
import { IsIn, IsOptional } from 'class-validator';

export class GetTaskFilteredDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  search: string;
}
