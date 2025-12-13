import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };

    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find(track => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.tracks.find(track => track.id === id);
    
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string): void {
    const index = this.tracks.findIndex(track => track.id === id);
    
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(index, 1);
  }

  removeArtistReference(artistId: string): void {
    this.tracks.forEach(track => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumReference(albumId: string): void {
    this.tracks.forEach(track => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  exists(id: string): boolean {
    return this.tracks.some(track => track.id === id);
  }
}

