export type ShipmentStatus='preparing'|'ready'|'in_transit'|'delivered'|'delayed';
export interface Shipment{readonly id:string;readonly shipmentNumber:string;readonly orderId:string;readonly orderNumber:string;readonly customerName:string;readonly destination:string;readonly carrier:string;readonly expectedAt:string;readonly status:ShipmentStatus;}
export interface ShippingFilters{readonly search:string;readonly status:ShipmentStatus|'';readonly carrier:string;readonly period:'all'|'today'|'week'|'month';readonly page:number;readonly perPage:number;}
export interface ShippingSummary{readonly total:number;readonly preparing:number;readonly inTransit:number;readonly delivered:number;readonly delayed:number;}
export interface ShippingPage{readonly items:readonly Shipment[];readonly summary:ShippingSummary;readonly total:number;readonly page:number;readonly perPage:number;}
export const SHIPMENT_STATUS_LABELS:Record<ShipmentStatus,string>={preparing:'قيد التجهيز',ready:'جاهز للشحن',in_transit:'قيد التوصيل',delivered:'تم التسليم',delayed:'متأخر'};
