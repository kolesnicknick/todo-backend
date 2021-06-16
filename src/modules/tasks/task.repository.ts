import { EntityRepository, Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    return await task.save();
  }

  async getTasks(filter: GetTaskFilteredDto, user: User) {
    const { status, search } = filter;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :id', { id: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` });
    }

    const tasks = query.getMany();
    return tasks;
  }
}
