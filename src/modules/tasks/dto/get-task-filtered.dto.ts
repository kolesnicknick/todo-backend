import { IsIn, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class GetTaskFilteredDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  search: string;
}
