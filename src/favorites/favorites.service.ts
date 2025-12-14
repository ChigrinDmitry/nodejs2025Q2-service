import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteItemEntity } from './entities/favorite-item.entity';
import { FavoritesResponse } from './interfaces/favorites-response.interface';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteItemEntity)
    private readonly favoriteRepository: Repository<FavoriteItemEntity>,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favoriteItems = await this.favoriteRepository.find();

    const artistIds = favoriteItems
      .filter((item) => item.entityType === 'artist')
      .map((item) => item.entityId);

    const albumIds = favoriteItems
      .filter((item) => item.entityType === 'album')
      .map((item) => item.entityId);

    const trackIds = favoriteItems
      .filter((item) => item.entityType === 'track')
      .map((item) => item.entityId);

    const artists = await Promise.all(
      artistIds.map(async (id) => {
        try {
          return await this.artistsService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) => results.filter((artist) => artist !== null));

    const albums = await Promise.all(
      albumIds.map(async (id) => {
        try {
          return await this.albumsService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) => results.filter((album) => album !== null));

    const tracks = await Promise.all(
      trackIds.map(async (id) => {
        try {
          return await this.tracksService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) => results.filter((track) => track !== null));

    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    const exists = await this.tracksService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'track' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'track',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'track' },
    });

    if (!favorite) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async addAlbum(id: string): Promise<void> {
    const exists = await this.albumsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'album' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'album',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'album' },
    });

    if (!favorite) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async addArtist(id: string): Promise<void> {
    const exists = await this.artistsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'artist' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'artist',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'artist' },
    });

    if (!favorite) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async removeArtistById(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'artist' },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }

  async removeAlbumById(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'album' },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }

  async removeTrackById(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'track' },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }
}
