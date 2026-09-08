export interface Brand{readonly id:string;readonly nameAr:string;readonly nameEn:string;readonly logo:string;readonly productCount:number;readonly order:number;readonly visible:boolean}
export interface BrandFilters{readonly search:string;readonly visibility:'all'|'visible'|'hidden'}
export interface CreateBrandRequest{readonly nameAr:string;readonly nameEn:string;readonly slug:string;readonly order:number;readonly visible:boolean;readonly description:string}
