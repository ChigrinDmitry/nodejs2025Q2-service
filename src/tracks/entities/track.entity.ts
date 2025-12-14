import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { AlbumEntity } from '../../albums/entities/album.entity';

@Entity('tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => ArtistEntity, (artist) => artist.tracks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId' })
  album: AlbumEntity;
}
