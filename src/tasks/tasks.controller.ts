import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {
  }

  @Get()
  tasks(@Query() filter: GetTaskFilteredDto): Task[] {
    if (Object.keys(filter).length) {
      return this.taskService.getFilteredTasks(filter);
    } else {
      return this.taskService.getTasks();
    }

  }

  @Get('/:id')
  singleTask(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task {
    return this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string,
                   @Body('status') status: TaskStatus): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }
}
