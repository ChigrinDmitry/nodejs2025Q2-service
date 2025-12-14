import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  private tracksService: any;
  private favoritesService: any;

  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  setDependencies(tracksService: any, favoritesService: any) {
    this.tracksService = tracksService;
    this.favoritesService = favoritesService;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create({
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    });

    return await this.albumRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    // Cascade delete
    if (this.tracksService) {
      await this.tracksService.removeAlbumReference(id);
    }
    if (this.favoritesService) {
      await this.favoritesService.removeAlbumById(id);
    }

    await this.albumRepository.remove(album);
  }

  async removeArtistReference(artistId: string): Promise<void> {
    const albums = await this.albumRepository.find({ where: { artistId } });

    for (const album of albums) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.albumRepository.count({ where: { id } });
    return count > 0;
  }
}
