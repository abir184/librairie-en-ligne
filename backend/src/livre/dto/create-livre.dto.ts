import { IsString, IsNumber, IsOptional, IsInt, Min, MinLength } from 'class-validator';

export class CreateLivreDto {
  @IsString()
  @MinLength(1)
  titre: string;

  @IsString()
  @MinLength(1)
  auteur: string;

  @IsNumber()
  @Min(0.01)
  prix: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  categorieId?: number;
}