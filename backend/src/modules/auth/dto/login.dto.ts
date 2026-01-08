import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 4 characters)',
    example: 'password123',
    minLength: 4,
    type: String,
  })
  @IsString()
  @MinLength(4)
  password: string;
}
