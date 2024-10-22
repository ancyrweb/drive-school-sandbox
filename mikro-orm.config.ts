import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  clientUrl: 'postgresql://driveschool:password123@localhost:5432/driveschool',
  entities: ['./src/modules/**/infrastructure/persistence/sql/entities/*.ts'],
  entitiesTs: ['./src/modules/**/infrastructure/persistence/sql/entities/*.ts'],
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    pathTs: './migrations',
    glob: '*.{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    emit: 'ts',
  },
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
});
