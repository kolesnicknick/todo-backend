import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }


  public async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} is not found`);
    }
    return found;
  }

  public async updateTaskStatus(id: number, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id);
    if (task.userId !== user.id) {
      throw new UnauthorizedException('This task does not belong to current user');
    }
    task.status = status;
    await task.save();

    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  public async deleteTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} is not found`);
    } else {
      if (found.userId !== user.id) {
        throw new UnauthorizedException('This task does not belong to current user');
      }
      await this.taskRepository.remove(found);
    }
    return found;
  }


  public async getTasks(filter: GetTaskFilteredDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filter, user);
  }

}
