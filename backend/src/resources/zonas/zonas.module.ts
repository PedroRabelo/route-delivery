import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';
import { ZonaCoords } from './entities/zona-coords.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zona, ZonaCoords])],
  controllers: [ZonasController],
  providers: [ZonasService]
})
export class ZonasModule { }
