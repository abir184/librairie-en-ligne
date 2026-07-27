import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LigneCommandeInputDto {
  @IsInt()
  livreId: number;

  @IsInt()
  @Min(1)
  quantite: number;
}

export class CreateCommandeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeInputDto)
  lignes: LigneCommandeInputDto[];
}