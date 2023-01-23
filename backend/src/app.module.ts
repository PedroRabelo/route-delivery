import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './resources/pedidos/pedidos.module';

const timeout = 600000;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '3.230.101.136',
      port: 1433,
      username: 'sistema',
      password: 'dbaGest@',
      database: 'roterizador',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
