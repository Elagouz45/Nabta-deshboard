export interface CustomerOrder{readonly id:string;readonly date:string;readonly status:'completed'|'processing';readonly total:number}
export interface Customer{readonly id:string;readonly name:string;readonly mobile:string;readonly city:string;readonly joinedAt:string;readonly ordersCount:number;readonly totalSpent:number;readonly recentOrders:readonly CustomerOrder[]}
export interface CustomerFilters{readonly search:string;readonly city:string;readonly sort:'recent'|'spent'|'orders'}
