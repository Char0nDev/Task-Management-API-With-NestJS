import { TaskDto } from './dtos/task.dto';
import { Model, Types } from 'mongoose';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { UpdateTaskDto } from './dtos/updateTask.dto';

enum Priority {
  High = 1,
  Medium = 2,
  Low = 3,
}

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private TaskModel: Model<Task>) {}
  async create(taskData: TaskDto, owner: Types.ObjectId) {
    const { title, description, category, priorityLevel, status } = taskData;

    let findTask = await this.TaskModel.findOne({
      owner,
      title,
    });

    if (findTask)
      throw new BadRequestException('The task already excite. (change title)');

    try {
      findTask = await this.TaskModel.create({
        owner,
        title,
        description,
        category,
        priorityLevel,
        status,
      });

      await findTask.save();

      return {
        message: 'Created.',
        statusCode: HttpStatus.OK,
        taskDetails: {
          title,
          description,
          category,
          priorityLevel,
          status,
        },
        timestamp: new Date(),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Something wrong happened.');
    }
  }

  async find(taskTitle: string, owner: Types.ObjectId) {
    const task = await this.TaskModel.findOne({
      owner,
      title: taskTitle,
    });

    if (!task) throw new NotFoundException('The task is not excite.');

    const { title, description, status, category, priorityLevel } = task;

    return {
      title,
      description,
      category,
      status,
    };
  }

  async findAll(owner: Types.ObjectId) {
    const tasks = await this.TaskModel.find({
      owner,
    });

    if (!tasks) throw new NotFoundException('you have any task.');

    const data = [];
    tasks.forEach((task) => {
      data.push({
        title: task.title,
        description: task.description,
        category: task.category,
        priorityLevel: task.priorityLevel,
        status: task.status,
      });
    });

    return data;
  }

  async delete(title: string, owner: Types.ObjectId) {
    const task = await this.TaskModel.findOne({
      title,
      owner,
    });

    if (!task) throw new NotFoundException('This task is already not excite.');

    await task.deleteOne();

    return {
      message: 'Task has removed successfully.',
      statusCode: HttpStatus.OK,
    };
  }

  async update(
    taskTitle: string,
    owner: Types.ObjectId,
    updateData: UpdateTaskDto,
  ) {
    const task = await this.TaskModel.findOneAndUpdate(
      {
        title: taskTitle,
        owner,
      },
      {
        ...updateData,
      },
    );

    if (!task) throw new NotFoundException('This task is not excite.');

    return {
      message: 'Update successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async findAllByCategory(category: string, owner: Types.ObjectId) {
    const tasks = await this.TaskModel.find({
      owner,
      category,
    });

    if (!tasks)
      throw new NotFoundException('There are any tasks with on the category');
    if (tasks.length == 0)
      throw new NotFoundException('There are any tasks with on the category');

    return tasks;
  }

  async findAllByStatus(status: string, owner: Types.ObjectId) {
    const tasks = await this.TaskModel.find({
      owner,
      status,
    });

    if (!tasks)
      throw new NotFoundException('There are any tasks with on the status');
    if (tasks.length == 0)
      throw new NotFoundException('There are any tasks with on the status');

    return tasks;
  }

  async findAllByPriority(priority: string, owner: Types.ObjectId) {
    const tasks = await this.TaskModel.find({
      owner,
      priorityLevel: priority,
    });

    if (!tasks)
      throw new NotFoundException(
        'There are any tasks with on the priority level',
      );
    if (tasks.length == 0)
      throw new NotFoundException(
        'There are any tasks with on the priority level',
      );

    return tasks;
  }

  async sortTasksByPriority(owner: Types.ObjectId) {
    const tasks = await this.TaskModel.find({
      owner,
    });

    if (!tasks) throw new NotFoundException(`You haven't any task.`);
    if (tasks.length == 0) throw new NotFoundException(`You haven't any task.`);

    let tasksArray = [];

    tasks.forEach((task: TaskDto) => {
      const { title, description, status, priorityLevel, category } = task;
      tasksArray.push({
        title,
        description,
        status,
        priorityLevel,
        category,
        priority: Priority[priorityLevel],
      });
    });

    return tasksArray.sort((a, b) => a.priority - b.priority);
  }
}
