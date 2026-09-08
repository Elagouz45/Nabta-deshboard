import { PaymentRecord } from '../models/payment.models';
const customers=['أحمد علي','سارة خالد','محمد عبدالله','نورة سعد','خالد منصور','منى عادل','ياسر حسن','هبة محمد'];
const statuses=['paid','pending','failed','partially_refunded','paid'] as const;
const methods=['card','cash_on_delivery','wallet'] as const;
export const DEMO_PAYMENTS:readonly PaymentRecord[]=Array.from({length:102},(_,index)=>({id:String(10482-index),paymentNumber:`PAY-${10482-index}`,orderId:String(3021-index),orderNumber:`ORD-${3021-index}`,customerName:customers[index%customers.length],method:methods[index%methods.length],amount:980+((index*735)%6200),status:statuses[index%statuses.length],createdAt:new Date(2026,8,7-Math.floor(index/3)).toISOString()}));
