import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password (6-100 characters)',
    example: 'AdminPassword123',
    minLength: 6,
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    description: 'Admin full name',
    example: 'Admin User',
    minLength: 2,
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
