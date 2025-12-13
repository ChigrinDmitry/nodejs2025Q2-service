import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];
  private tracksService: any;
  private favoritesService: any;

  setDependencies(tracksService: any, favoritesService: any) {
    this.tracksService = tracksService;
    this.favoritesService = favoritesService;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };

    this.albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find(album => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.albums.find(album => album.id === id);
    
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string): void {
    const index = this.albums.findIndex(album => album.id === id);
    
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    // Cascade delete
    if (this.tracksService) {
      this.tracksService.removeAlbumReference(id);
    }
    if (this.favoritesService) {
      this.favoritesService.removeAlbumById(id);
    }

    this.albums.splice(index, 1);
  }

  removeArtistReference(artistId: string): void {
    this.albums.forEach(album => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  exists(id: string): boolean {
    return this.albums.some(album => album.id === id);
  }
}
