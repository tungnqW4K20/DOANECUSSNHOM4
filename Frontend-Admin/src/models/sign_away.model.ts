export interface Upsign_away_DTO {
  idaway:string;
  idAsset:string;
  DivisionId:number;
  PersonnelId:number | null;
}
export interface Addsign_away_DTO {
  idAsset:string;
  DivisionId:number;
  PersonnelId:number | null;
}
export interface Getsign_away_DTO{
    idaway:string;
  idAsset:string;
  AssetName:string;
  DivisionId:number;
  PersonnelId:number | null;
  PersonnelName:string | null;
  DivisionName:string | null;
  created_at: string;
}
