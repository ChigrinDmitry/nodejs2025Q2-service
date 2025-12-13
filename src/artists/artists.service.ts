import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];
  private albumsService: any;
  private tracksService: any;
  private favoritesService: any;

  setDependencies(albumsService: any, tracksService: any, favoritesService: any) {
    this.albumsService = albumsService;
    this.tracksService = tracksService;
    this.favoritesService = favoritesService;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    // Cascade delete: remove references and from favorites
    if (this.albumsService) {
      this.albumsService.removeArtistReference(id);
    }
    if (this.tracksService) {
      this.tracksService.removeArtistReference(id);
    }
    if (this.favoritesService) {
      this.favoritesService.removeArtistById(id);
    }

    this.artists.splice(index, 1);
  }

  exists(id: string): boolean {
    return this.artists.some(artist => artist.id === id);
  }
}

