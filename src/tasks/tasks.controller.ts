import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from './dtos/task.dto';
import { AuthGuard } from 'src/guards/authentication.guards';
import { Types } from 'mongoose';
import { title } from 'process';
import { StringPipe } from './pipes/string.pipe';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async create(@Body() taskData: TaskDto, @Req() { userId }) {
    return this.tasksService.create(taskData, new Types.ObjectId(userId));
  }

  @Get('find')
  async find(@Query('title', StringPipe) title: string, @Req() { userId }) {
    return this.tasksService.find(title, new Types.ObjectId(userId));
  }

  @Get('findAll')
  async findAll(@Req() { userId }) {
    return this.tasksService.findAll(new Types.ObjectId(userId));
  }

  @Delete('delete')
  async delete(@Query('title') title: string, @Req() { userId }) {
    return this.tasksService.delete(title, new Types.ObjectId(userId));
  }

  @Patch('update')
  async update(
    @Query('title', StringPipe) title: string,
    @Req() { userId },
    @Body() updateTaskData: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      title,
      new Types.ObjectId(userId),
      updateTaskData,
    );
  }

  @Get('findAll-by-category/:category')
  async findAllByCategory(
    @Param('category') category: string,
    @Req() { userId },
  ) {
    return this.tasksService.findAllByCategory(
      category,
      new Types.ObjectId(userId),
    );
  }

  @Get('findAll-by-status/:status')
  async findAllByStatus(@Param('status') status: string, @Req() { userId }) {
    return this.tasksService.findAllByStatus(
      status,
      new Types.ObjectId(userId),
    );
  }

  @Get('findAll-by-priority/:priority')
  async findAllByPriority(
    @Param('priority') priority: string,
    @Req() { userId },
  ) {
    return this.tasksService.findAllByPriority(
      priority,
      new Types.ObjectId(userId),
    );
  }

  @Get('sort-by-priority')
  async sortByPriority(@Req() { userId }) {
    return this.tasksService.sortTasksByPriority(new Types.ObjectId(userId));
  }
}
