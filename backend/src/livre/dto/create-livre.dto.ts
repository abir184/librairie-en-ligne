export class CreateLivreDto {
  titre: string;
  auteur: string;
  prix: number;
  stock: number;
  description?: string;
  categorieId?: number;
}