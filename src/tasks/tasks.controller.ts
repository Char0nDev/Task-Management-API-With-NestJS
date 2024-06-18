import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from './dtos/task.dto';
import { AuthGuard } from 'src/guards/authentication.guards';
import { Types } from 'mongoose';
import { title } from 'process';
import { StringPipe } from './pipes/string.pipe';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async create(@Body() taskData : TaskDto , @Req() {userId}){
    return this.tasksService.create(taskData ,new Types.ObjectId(userId))
  }

  @Get('find')
  async find(@Query('title', StringPipe) title : string , @Req() {userId}){
    return this.tasksService.find(title , new Types.ObjectId(userId))
  }

  @Get('findAll')
  async findAll(@Req() {userId}){
    return this.tasksService.findAll(new Types.ObjectId(userId))
  }

  @Delete('delete')
  async delete(@Query('title') title : string, @Req() {userId}){
    return this.tasksService.delete(title, new Types.ObjectId(userId))
  }

  @Patch('update')
  async update(@Query('title', StringPipe) title : string , @Req() {userId} , @Body() updateTaskData : UpdateTaskDto){
    return this.tasksService.update(title, new Types.ObjectId(userId) , updateTaskData)
  }
}
