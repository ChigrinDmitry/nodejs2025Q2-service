import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class FavoriteItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({
    type: 'enum',
    enum: ['artist', 'album', 'track'],
  })
  entityType: 'artist' | 'album' | 'track';
}
