
export interface GetTienTe_DTO {
  id_tt: number;        
  ma_tt: string;        
  ten_tt: string;       
  TotalRecords: number; 
}


export interface AddTienTe_DTO {
  ma_tt: string;
  ten_tt: string;
}


export interface UpTienTe_DTO {
  id_tt: number;
  ma_tt: string;
  ten_tt: string;
}
