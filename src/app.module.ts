import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { BlurElementsService } from './services/blur-elements.service';
import { AuthController } from './controllers/auth.controller';
import { BlurElementsController } from './controllers/blur-elements.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        migrations: {
          path: './dist/migrations',
          pathTs: './src/migrations',
        },
        entities: ['./dist/entities'],
        entitiesTs: ['./src/entities'],
        dbName: config.get("DB_NAME"),
        user: config.get("DB_USER"),
        password: config.get("DB_PASSWORD"),
        host: config.get("DB_HOST"),
        port: config.get("DB_PORT"),
        driver: PostgreSqlDriver,
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_LIFETIME") },
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [
    AuthController,
    BlurElementsController
  ],
  providers: [
    AuthService,
    BlurElementsService
  ],
})
export class AppModule {}
