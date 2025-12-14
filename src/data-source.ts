import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from './users/entities/user.entity';
import { ArtistEntity } from './artists/entities/artist.entity';
import { AlbumEntity } from './albums/entities/album.entity';
import { TrackEntity } from './tracks/entities/track.entity';
import { FavoriteItemEntity } from './favorites/entities/favorite-item.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'home_library',
  entities: [
    UserEntity,
    ArtistEntity,
    AlbumEntity,
    TrackEntity,
    FavoriteItemEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
