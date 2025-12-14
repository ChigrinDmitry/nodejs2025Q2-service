import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from './entities/artist.entity';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  private albumsService: any;
  private tracksService: any;
  private favoritesService: any;

  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
  ) {}

  // Метод для установки зависимостей (будет вызван из модуля)
  setDependencies(albumsService: any, tracksService: any, favoritesService: any) {
    this.albumsService = albumsService;
    this.tracksService = tracksService;
    this.favoritesService = favoritesService;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create({
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });

    return await this.artistRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Cascade delete: remove references and from favorites
    if (this.albumsService) {
      await this.albumsService.removeArtistReference(id);
    }
    if (this.tracksService) {
      await this.tracksService.removeArtistReference(id);
    }
    if (this.favoritesService) {
      await this.favoritesService.removeArtistById(id);
    }

    await this.artistRepository.remove(artist);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.artistRepository.count({ where: { id } });
    return count > 0;
  }
}
