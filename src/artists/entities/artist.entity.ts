import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlbumEntity } from '../../albums/entities/album.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';

@Entity('artists')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist)
  tracks: TrackEntity[];
}
