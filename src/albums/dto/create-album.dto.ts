import { IsString, IsNumber, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}

