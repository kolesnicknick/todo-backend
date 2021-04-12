import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';

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

  public async updateTaskStatus(id: number, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();

    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  public async deleteTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} is not found`);
    } else {
      await this.taskRepository.remove(found);
    }
    return found;
  }


  public async getTasks(filter: GetTaskFilteredDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filter);
  }

  // public async getFilteredTasks(filter: GetTaskFilteredDto): Promise<Task[]> {
  //   let tasks = await this.getTasks();
  //   if (filter.status) {
  //     tasks = tasks.filter(task => task.status.includes(filter.status));
  //   }
  //   if (filter.search) {
  //     tasks = tasks.filter(task => {
  //       return task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
  //         task.description.toLowerCase().includes(filter.search.toLowerCase());
  //     });
  //   }
  //   return tasks;
  // }

}
