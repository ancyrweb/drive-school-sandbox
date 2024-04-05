import { Module } from '@nestjs/common';

import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app-controller.js';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        const isTestEnvironment = process.env.NODE_ENV === 'test';

        return {
          metadataProvider: TsMorphMetadataProvider,
          clientUrl:
            'postgresql://driveschool:password123@localhost:13001/driveschool',
          driver: PostgreSqlDriver,
          discovery: {
            warnWhenNoEntities: false,
          },
          ...(isTestEnvironment
            ? {
                allowGlobalContext: true,
                disableIdentityMap: false,
              }
            : {}),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
