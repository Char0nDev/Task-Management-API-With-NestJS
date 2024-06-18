import { TaskDto } from './dtos/task.dto';
import { Model, Types } from 'mongoose';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, HttpStatus, Injectable, NotFoundException, Type } from '@nestjs/common';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private TaskModel : Model<Task> ){}
    async create(taskData : TaskDto , owner : Types.ObjectId){
        const {
            title,
            description,
            category,
            priorityLevel,
            status
        } = taskData;
        
        let findTask = await this.TaskModel.findOne({
            owner,
            title
        });

        if(findTask) throw new BadRequestException('The task already excite. (change title)');

        try{
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
                message : 'Created.',
                statusCode : HttpStatus.OK,
                taskDetails : {
                    title,
                    description,
                    category,
                    priorityLevel,
                    status
                },
                timestamp : new Date() 
            }
        }catch(e){
            console.log(e)
            throw new BadRequestException('Something wrong happened.')
        }
    }

    async find(taskTitle : string , owner : Types.ObjectId){
        const task = await this.TaskModel.findOne({
            owner,
            title : taskTitle
        });

        if(!task) throw new NotFoundException('The task is not excite.');

        const {
            title,
            description,
            status,
            category,
            priorityLevel
        } = task;

        return {
            title,
            description,
            category,
            status
        }
    }

    async findAll(owner : Types.ObjectId){
        const tasks = await this.TaskModel.find({
            owner
        });

        if(!tasks) throw new NotFoundException('you have any task.');

        const data = [];
        tasks.forEach(task  => {
            data.push({
                title : task.title,
                description : task.description,
                category : task.category,
                priorityLevel : task.priorityLevel,
                status : task.status
            })
        });

        return data;
    }

    async delete(title : string, owner : Types.ObjectId){
        const task = await this.TaskModel.findOne({
            title,
            owner
        });
        
        if(!task) throw new NotFoundException('This task is already not excite.');

        await task.deleteOne();

        return {
            message : 'Task has removed successfully.',
            statusCode : HttpStatus.OK
        }
    }

    async update(taskTitle : string , owner : Types.ObjectId , updateData : UpdateTaskDto){
        const task = await this.TaskModel.findOneAndUpdate(
            {
                title : taskTitle,
                owner,
            },
            {
                ...updateData
            }
        );

        if(!task) throw new NotFoundException('This task is not excite.');

        return {
            message : 'Update successfully',
            statusCode : HttpStatus.OK,
        }
    }

}
