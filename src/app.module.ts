import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ArtistsService } from './artists/artists.service';
import { AlbumsService } from './albums/albums.service';
import { TracksService } from './tracks/tracks.service';
import { FavoritesService } from './favorites/favorites.service';

@Module({
  imports: [
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  onModuleInit() {
    // Setup cascade dependencies
    this.artistsService.setDependencies(
      this.albumsService,
      this.tracksService,
      this.favoritesService,
    );
    this.albumsService.setDependencies(
      this.tracksService,
      this.favoritesService,
    );
    this.tracksService.setDependencies(this.favoritesService);
  }
}
