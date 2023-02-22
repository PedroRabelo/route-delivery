import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './resources/pedidos/pedidos.module';
import { ZonasModule } from './resources/zonas/zonas.module';

const timeout = 600000;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_URL,
      port: 1433,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PWD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      extra: {
        validateConnection: false,
        trustServerCertificate: true,
      },
      requestTimeout: timeout,
      pool: {
        max: 1000,
        min: 1,
        idleTimeoutMillis: timeout,
        acquireTimeoutMillis: timeout,
      },
    }),
    ScheduleModule.forRoot(),
    PedidosModule,
    ZonasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
