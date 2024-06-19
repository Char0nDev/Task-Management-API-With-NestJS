import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, Length } from 'class-validator';

export class TaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @ApiProperty()
  @Length(1, 100, { message: 'e.g : Work, Personal' })
  category: string;

  @ApiProperty()
  @IsIn(['Low', 'Medium', 'High'])
  priorityLevel: string;

  @ApiProperty()
  @IsIn(['pending', 'in-progress', 'completed'])
  status: string;
}
