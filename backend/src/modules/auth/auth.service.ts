import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UserRepository } from '@/database/mongo/repositories/user.repository';
import { UserRole } from '@/database/mongo/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token with user info
    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const exists = await this.userRepository.exists(registerDto.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create new user with USER role
    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: UserRole.USER,
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async registerAdmin(
    registerAdminDto: RegisterAdminDto,
    requestingUserId: string,
  ) {
    // Verify requesting user is super admin
    const requestingUser = await this.userRepository.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can create admin users');
    }

    // Check if user already exists
    const exists = await this.userRepository.exists(registerAdminDto.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(registerAdminDto.password);

    // Create new user with ADMIN role
    const user = await this.userRepository.create({
      email: registerAdminDto.email,
      password: hashedPassword,
      name: registerAdminDto.name,
      role: UserRole.ADMIN,
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, email, role, timestamp] = decoded.split(':');

      // Basic token expiration check (24 hours)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - tokenTime > twentyFourHours) {
        return null;
      }

      // Verify user still exists and is active
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      return {
        userId,
        email,
        role,
      };
    } catch {
      return null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private generateToken(user: any): string {
    const payload = `${user._id}:${user.email}:${user.role}:${Date.now()}`;
    return Buffer.from(payload).toString('base64');
  }
}
