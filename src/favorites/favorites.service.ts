import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { Favorites } from './interfaces/favorites.interface';

@Injectable()
export class FavoritesService {
  private favoriteArtists: Set<string> = new Set();
  private favoriteAlbums: Set<string> = new Set();
  private favoriteTracks: Set<string> = new Set();

  constructor(
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  findAll(): Favorites {
    const artists = Array.from(this.favoriteArtists)
      .map(id => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(artist => artist !== null);

    const albums = Array.from(this.favoriteAlbums)
      .map(id => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(album => album !== null);

    const tracks = Array.from(this.favoriteTracks)
      .map(id => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(track => track !== null);

    return {
      artists,
      albums,
      tracks,
    };
  }

  addArtist(id: string): void {
    try {
      this.artistsService.findOne(id);
      this.favoriteArtists.add(id);
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  removeArtist(id: string): void {
    if (!this.favoriteArtists.has(id)) {
      throw new NotFoundException('Artist not found in favorites');
    }
    this.favoriteArtists.delete(id);
  }

  addAlbum(id: string): void {
    try {
      this.albumsService.findOne(id);
      this.favoriteAlbums.add(id);
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  removeAlbum(id: string): void {
    if (!this.favoriteAlbums.has(id)) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.favoriteAlbums.delete(id);
  }

  addTrack(id: string): void {
    try {
      this.tracksService.findOne(id);
      this.favoriteTracks.add(id);
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  removeTrack(id: string): void {
    if (!this.favoriteTracks.has(id)) {
      throw new NotFoundException('Track not found in favorites');
    }
    this.favoriteTracks.delete(id);
  }

  removeArtistById(artistId: string): void {
    this.favoriteArtists.delete(artistId);
  }

  removeAlbumById(albumId: string): void {
    this.favoriteAlbums.delete(albumId);
  }

  removeTrackById(trackId: string): void {
    this.favoriteTracks.delete(trackId);
  }
}

