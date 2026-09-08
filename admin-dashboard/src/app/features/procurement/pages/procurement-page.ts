import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProcurementNavigationComponent } from '../components/procurement-navigation.component';
import { PurchaseOrderStatus } from '../models/procurement.model';
import { ProcurementStore } from '../stores/procurement.store';

type ProcurementPageKind = 'suppliers' | 'purchase-orders' | 'receipts';

@Component({ imports:[DecimalPipe,ReactiveFormsModule,ProcurementNavigationComponent], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./procurement-page.html', styleUrl:'./procurement-page.scss' })
export class ProcurementPage {
  readonly store=inject(ProcurementStore); private readonly route=inject(ActivatedRoute);
  readonly kind=this.route.snapshot.data['kind'] as ProcurementPageKind;
  readonly search=signal(''); readonly dialog=signal<'supplier'|'order'|'receipt'|null>(null); readonly selectedOrderId=signal('');
  readonly supplierForm=new FormGroup({name:new FormControl('',{nonNullable:true,validators:[Validators.required]}),contactName:new FormControl('',{nonNullable:true,validators:[Validators.required]}),phone:new FormControl('',{nonNullable:true,validators:[Validators.required]}),email:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.email]}),city:new FormControl('',{nonNullable:true,validators:[Validators.required]})});
  readonly orderForm=new FormGroup({supplierId:new FormControl('',{nonNullable:true,validators:[Validators.required]}),expectedAt:new FormControl('',{nonNullable:true,validators:[Validators.required]}),itemsCount:new FormControl(1,{nonNullable:true,validators:[Validators.required,Validators.min(1)]}),total:new FormControl(0,{nonNullable:true,validators:[Validators.required,Validators.min(1)]})});
  readonly receiptForm=new FormGroup({quantity:new FormControl(1,{nonNullable:true,validators:[Validators.required,Validators.min(1)]}),warehouse:new FormControl('فرع القاهرة',{nonNullable:true,validators:[Validators.required]})});
  readonly filteredSuppliers=computed(()=>{const q=this.search().trim();return this.store.suppliers().filter(item=>!q||`${item.name} ${item.contactName} ${item.phone}`.includes(q));});
  readonly filteredOrders=computed(()=>{const q=this.search().trim();return this.store.orders().filter(item=>!q||`${item.number} ${item.supplierName}`.includes(q));});
  readonly filteredReceipts=computed(()=>{const q=this.search().trim();return this.store.receipts().filter(item=>!q||`${item.number} ${item.purchaseOrderNumber} ${item.supplierName}`.includes(q));});
  readonly title=computed(()=>this.kind==='suppliers'?'الموردون':this.kind==='purchase-orders'?'أوامر الشراء':'استلام التوريدات');
  readonly subtitle=computed(()=>this.kind==='suppliers'?'أدر بيانات الموردين وتابع جاهزيتهم للتوريد.':this.kind==='purchase-orders'?'أنشئ أوامر الشراء وتابع اعتمادها ووصولها.':'سجّل الكميات الواردة وحدّث حالة أوامر الشراء.');
  openCreateDialog():void{if(this.kind==='suppliers')this.dialog.set('supplier');else if(this.kind==='purchase-orders')this.dialog.set('order');else{const first=this.store.pendingOrders()[0];if(first)this.openReceipt(first.id);}}
  openReceipt(orderId:string):void{const order=this.store.orders().find(item=>item.id===orderId);if(!order)return;this.selectedOrderId.set(orderId);this.receiptForm.reset({quantity:Math.max(1,order.itemsCount-order.receivedItems),warehouse:'فرع القاهرة'});this.dialog.set('receipt');}
  saveSupplier():void{if(this.supplierForm.invalid){this.supplierForm.markAllAsTouched();return;}this.store.addSupplier(this.supplierForm.getRawValue());this.supplierForm.reset();this.dialog.set(null);}
  saveOrder():void{if(this.orderForm.invalid){this.orderForm.markAllAsTouched();return;}this.store.addOrder(this.orderForm.getRawValue());this.orderForm.reset({supplierId:'',expectedAt:'',itemsCount:1,total:0});this.dialog.set(null);}
  saveReceipt():void{if(this.receiptForm.invalid)return;const value=this.receiptForm.getRawValue();this.store.receive(this.selectedOrderId(),value.quantity,value.warehouse);this.dialog.set(null);}
  statusLabel(status:PurchaseOrderStatus):string{return({draft:'مسودة',sent:'مرسل للمورد',partial:'استلام جزئي',received:'مكتمل',cancelled:'ملغي'} as const)[status];}
}
