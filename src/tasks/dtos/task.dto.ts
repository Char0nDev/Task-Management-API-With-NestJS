import {IsIn, IsNotEmpty, Length } from "class-validator"

export class TaskDto {
    @IsNotEmpty()
    @Length(1, 100) 
    title : string

    @IsNotEmpty()
    @Length(1, 500 )
    description : string

    @Length(1, 100 , {message : 'e.g : Work, Personal'})
    category : string
    
    @IsIn(['Low' , 'Medium' , 'High']) 
    priorityLevel : string

    @IsIn(['pending', 'in-progress', 'completed'])
    status : string
}