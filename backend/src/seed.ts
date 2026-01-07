import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRepository } from './database/mongo/repositories/user.repository';
import { ProductRepository } from './database/mongo/repositories/product.repository';
import { UserSeeder, ProductSeeder } from './database/seeders';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🌱 Starting database seeding...');

  try {
    // Get repositories
    const userRepository = app.get(UserRepository);
    const productRepository = app.get(ProductRepository);

    // Initialize seeders
    const userSeeder = new UserSeeder(userRepository);
    const productSeeder = new ProductSeeder(productRepository);

    // Run seeders
    await userSeeder.seed();
    await productSeeder.seed();

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
