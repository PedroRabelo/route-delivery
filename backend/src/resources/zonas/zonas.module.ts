import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';

@Module({
  controllers: [ZonasController],
  providers: [ZonasService]
})
export class ZonasModule {}
