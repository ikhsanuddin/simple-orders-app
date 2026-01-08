import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/database/mongo/schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      `Authenticate a user with email and password. Returns an access token and user information.

      Demo credentials: 
       1. Email: user@example.com, Password: user123
       2. Email: admin@example.com, Password: admin123
       3. Email: superadmin@example.com, Password: superadmin123`,
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login successful. Returns access token and user information.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description:
      'Register a new user account with the `USER` role. The user can then login with the provided credentials.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Returns user information.',
    schema: {
      example: {
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'newuser@example.com',
          name: 'John Doe',
          role: 'user',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register admin user',
    description:
      'Register a new user with `ADMIN` role. This endpoint requires `SUPER_ADMIN` privileges and a valid JWT token.',
  })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Admin user registered successfully.',
    schema: {
      example: {
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'newadmin@example.com',
          name: 'New Admin User',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only super admins can create admin users.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async registerAdmin(
    @Body() registerAdminDto: RegisterAdminDto,
    @Req() req: any,
  ) {
    return this.authService.registerAdmin(registerAdminDto, req.user.userId);
  }
}
