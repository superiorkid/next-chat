import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
  newImage?: MemoryStoredFile;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(
    ({ value, obj }: { value: unknown; obj: Partial<UpdateUserDto> }) => {
      if (obj?.newImage) return false;

      if (value === true || value === 'true' || value === 1 || value === '1')
        return true;

      return false;
    },
  )
  removedImage?: boolean;

  @IsOptional()
  @IsString()
  bio?: string;
}
