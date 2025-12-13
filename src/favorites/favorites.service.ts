import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';
import { FavoritesResponse } from './interfaces/favorites-response.interface';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  findAll(): FavoritesResponse {
    const artists = this.favorites.artists
      .map(id => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(artist => artist !== null);

    const albums = this.favorites.albums
      .map(id => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(album => album !== null);

    const tracks = this.favorites.tracks
      .map(id => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(track => track !== null);

    return { artists, albums, tracks };
  }

  addTrack(id: string): void {
    if (!this.tracksService.exists(id)) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!this.albumsService.exists(id)) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!this.artistsService.exists(id)) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }

  removeArtistById(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }

  removeAlbumById(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  removeTrackById(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }
}
