import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {
  }

  @Get()
  tasks(@Query(ValidationPipe) filter: GetTaskFilteredDto,
        @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.log('GET Tasks');
    return this.taskService.getTasks(filter, user);
  }

  @Get('/:id')
  async singleTask(@Param('id', ParseIntPipe) id: number,
                   @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    if (task.userId !== user.id) {
      throw new UnauthorizedException('Access to this task denied');
    }
    return task;
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number,
             @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id', ParseIntPipe) id: number,
                   @Body('status', TaskStatusValidationPipe)
                     status: TaskStatus,
                   @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }
}
