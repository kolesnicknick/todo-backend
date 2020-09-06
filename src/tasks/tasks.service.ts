import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v4';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'FINISH FIRST PART NEST JS',
      description: 'FINISH NEST JS TO GET A JOB',
      status: TaskStatus.IN_PROGRESS,
    }, {
      id: '2',
      title: 'LEARN DOCKER',
      description: 'LEARN DOCKER from Stephen Grider course',
      status: TaskStatus.OPEN,
    }, {
      id: '3',
      title: 'LEARN Sequelize',
      description: 'Start and finish docs + this course with sequelize',
      status: TaskStatus.OPEN,
    },
    {
      id: '4',
      title: 'LEARN DATABASES',
      description: 'You should know indexes + inner join 3 tables + normalization',
      status: TaskStatus.OPEN,
    },

    {
      id: '5',
      title: 'GET READY FOR QUESTIONS',
      description: 'DATABASES/HEROKU/SQL/JS(binding)/TS(decorators+generics)/NODEJS/EXPRESS/NESTJS',
      status: TaskStatus.OPEN,
    },
    {
      id: '6',
      title: 'HEROKU UPLOAD WITH PGQL',
      description: 'Learn heroku upload better for this exact app',
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  public getTasks(): Task[] {
    return this.tasks;
  }

  public getFilteredTasks(filter: GetTaskFilteredDto): Task[] {
    let tasks = this.getTasks();
    if (filter.status) {
      tasks = tasks.filter(task => task.status === filter.status);
    }
    if (filter.search) {
      tasks = tasks.filter(task => {
        return task.title.includes(filter.search) || task.description.includes(filter.search);
      });
    }
    return tasks;
  }

  public getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  public deleteTaskById(id: string): Task {
    const idx = this.tasks.findIndex(task => task.id === id);
    const task = this.tasks[idx];
    delete this.tasks[idx];

    return task;
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.tasks.find(task => task.id === id);
    task.status = status;
    return task;
  }

  public createTask({ title, description }): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
