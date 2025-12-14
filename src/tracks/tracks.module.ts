import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TrackEntity } from './entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
