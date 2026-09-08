import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';
const page=(path:string,kind:string,title:string)=>({path,canActivate:[featureAvailabilityGuard('procurement'),adminGuard],data:{kind},title:`${title} | نبته`,loadComponent:()=>import('./pages/procurement-page').then(module=>module.ProcurementPage)});
export const PROCUREMENT_ROUTES:Routes=[{path:'',pathMatch:'full',redirectTo:'suppliers'},page('suppliers','suppliers','الموردون'),page('purchase-orders','purchase-orders','أوامر الشراء'),page('receipts','receipts','استلام التوريدات')];
