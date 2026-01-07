#!/bin/sh

echo "Starting application..."

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - checking if seeding is needed..."

# Check if we need to seed (only if no users exist)
# We'll run the seed script which handles checking if users already exist
echo "Running database seeder..."
pnpm seed || echo "Seeder already ran or encountered an error (this is normal on subsequent runs)"

# Start the application
echo "Starting NestJS application..."
exec pnpm run start:dev
