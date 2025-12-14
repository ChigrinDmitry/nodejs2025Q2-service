import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './entities/track.entity';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  private favoritesService: any;

  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
  ) {}

  setDependencies(favoritesService: any) {
    this.favoritesService = favoritesService;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    });

    return await this.trackRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    Object.assign(track, updateTrackDto);
    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Cascade delete
    if (this.favoritesService) {
      await this.favoritesService.removeTrackById(id);
    }

    await this.trackRepository.remove(track);
  }

  async removeArtistReference(artistId: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { artistId } });

    for (const track of tracks) {
      track.artistId = null;
      await this.trackRepository.save(track);
    }
  }

  async removeAlbumReference(albumId: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { albumId } });

    for (const track of tracks) {
      track.albumId = null;
      await this.trackRepository.save(track);
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.trackRepository.count({ where: { id } });
    return count > 0;
  }
}
