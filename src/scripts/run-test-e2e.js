require('dotenv').config({ path: '.env.test' });

const { execSync } = require('child_process');

// Run Prisma commands
execSync('yarn db-migrate', { stdio: 'ignore' });
execSync('yarn db-deploy', { stdio: 'ignore' });

execSync('ts-node src/scripts/cleanUpDB.ts', { stdio: 'ignore' });

execSync('yarn db-seed', { stdio: 'ignore' });

// Run Jest tests
execSync('npx jest --testPathPattern=src/__tests__/integration/ --detectOpenHandles', { stdio: 'inherit' });

execSync('ts-node src/scripts/cleanUpDB.ts', { stdio: 'ignore' });
