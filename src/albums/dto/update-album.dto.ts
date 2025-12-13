import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsUUID('4')
  @IsOptional()
  artistId?: string | null;
}
