import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';
import { Task, TaskStatus } from './task.entity';
import { GetTaskFilteredDto } from './dto/get-task-filtered.dto';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = {
  username: 'Niko',
  id: 12,
  password: 'somePassword',
  tasks: [],
}
const mockTask = {
  id: 1,
  userId: mockUser.id,
  title: 'hello',
  description: 'why?',
  taskStatus: TaskStatus.OPEN,
}

const mockedTaskSimpleValue = {
  title: mockTask.title,
  description: mockTask.description,
}

const mockTaskRepository = () => ({
  getTasks: jest.fn().mockResolvedValue('hello'),
  findOne: jest.fn().mockResolvedValue(mockedTaskSimpleValue),
  createTask: jest.fn().mockResolvedValue(mockTask),
  delete: jest.fn(),
});

describe('Task service test suite', () => {
  let taskRepository: TaskRepository;
  let taskService: TasksService;



  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTaskFilteredDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
      const result = await taskService.getTasks(filters, mockUser as User);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('hello');
    });
  });

  describe('getTask', () => {
    it('successfully gets task', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      const result = await taskService.getTaskById(mockUser.id);

      expect(taskRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual({ title: 'hello', description: 'why?' });
    });
  });

  describe('createTask', () => {
    it('successfully creates task', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await taskService.createTask(mockTask as CreateTaskDto, mockUser as User);

      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);

      expect(result).toEqual({
           "description": "why?",
           "id": 1,
           "taskStatus": "OPEN",
           "title": "hello",
           "userId": 12,
         },
     );
    });
  });
})
