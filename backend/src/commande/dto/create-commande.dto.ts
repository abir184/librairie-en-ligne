export class LigneCommandeInputDto {
  livreId: number;
  quantite: number;
}

export class CreateCommandeDto {
  clientId: number;
  lignes: LigneCommandeInputDto[];
}