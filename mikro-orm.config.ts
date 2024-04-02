import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  clientUrl: 'postgresql://driveschool:password123@localhost:5432/driveschool',
  entities: ['./src/modules/**/domain/*-entity.ts'],
  entitiesTs: ['./src/modules/**/domain/*-entity.ts'],
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    glob: '.js',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    emit: 'ts',
  },
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
});
