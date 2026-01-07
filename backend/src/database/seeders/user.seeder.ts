import { UserRepository } from '../mongo/repositories/user.repository';
import { UserRole } from '../mongo/schemas/user.schema';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async seed(): Promise<void> {
    console.log('\n📦 Seeding Users...\n');

    await this.seedSuperAdmin();
    await this.seedAdmin();
    await this.seedRegularUser();

    await this.printSummary();
  }

  private async seedSuperAdmin(): Promise<void> {
    const email = 'superadmin@example.com';
    const exists = await this.userRepository.exists(email);

    if (!exists) {
      await this.userRepository.create({
        email,
        password: await this.hashPassword('superadmin123'),
        name: 'Super Admin',
        role: UserRole.SUPER_ADMIN,
      });
      console.log('✓ Created Super Admin user');
      console.log(`  Email: ${email}`);
      console.log('  Password: superadmin123');
    } else {
      console.log('⊘ Super Admin already exists');
    }
  }

  private async seedAdmin(): Promise<void> {
    const email = 'admin@example.com';
    const exists = await this.userRepository.exists(email);

    if (!exists) {
      await this.userRepository.create({
        email,
        password: await this.hashPassword('admin123'),
        name: 'Admin User',
        role: UserRole.ADMIN,
      });
      console.log('✓ Created Admin user');
      console.log(`  Email: ${email}`);
      console.log('  Password: admin123');
    } else {
      console.log('⊘ Admin already exists');
    }
  }

  private async seedRegularUser(): Promise<void> {
    const email = 'user@example.com';
    const exists = await this.userRepository.exists(email);

    if (!exists) {
      await this.userRepository.create({
        email,
        password: await this.hashPassword('user123'),
        name: 'Regular User',
        role: UserRole.USER,
      });
      console.log('✓ Created Regular User');
      console.log(`  Email: ${email}`);
      console.log('  Password: user123');
    } else {
      console.log('⊘ Regular User already exists');
    }
  }

  private async printSummary(): Promise<void> {
    const superAdminCount = await this.userRepository.countByRole(
      UserRole.SUPER_ADMIN,
    );
    const adminCount = await this.userRepository.countByRole(UserRole.ADMIN);
    const userCount = await this.userRepository.countByRole(UserRole.USER);

    console.log('\nUser Summary:');
    console.log(`  Super Admins: ${superAdminCount}`);
    console.log(`  Admins: ${adminCount}`);
    console.log(`  Users: ${userCount}`);
    console.log(`  Total: ${superAdminCount + adminCount + userCount}`);
  }
}
