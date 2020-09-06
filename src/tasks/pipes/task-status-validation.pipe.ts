import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform{
  transform(value: any, metadata: ArgumentMetadata): any {
    value = value.toUpperCase();

    if(!(Object as any).values(TaskStatus).includes(value)){
      throw new BadRequestException(`Status ${value} is invalid status`)
    }
    return value;
  }
}
