import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';

@Entity('albums')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];
}
