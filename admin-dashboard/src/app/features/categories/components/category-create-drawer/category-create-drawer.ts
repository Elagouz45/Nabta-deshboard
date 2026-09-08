import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideImagePlus, LucideInfo, LucideX } from '@lucide/angular';
import { Category, CreateCategoryRequest } from '../../models/category.models';

type CategoryForm={name:FormControl<string>;parentId:FormControl<string>;slug:FormControl<string>;description:FormControl<string>;order:FormControl<number>;visible:FormControl<boolean>};
@Component({selector:'app-category-create-drawer',imports:[ReactiveFormsModule,LucideImagePlus,LucideInfo,LucideX],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./category-create-drawer.html',styleUrl:'./category-create-drawer.scss'})
export class CategoryCreateDrawer {
  readonly parents=input.required<readonly Category[]>();readonly saving=input(false);readonly closed=output<void>();readonly submitted=output<CreateCategoryRequest>();readonly imageUrl=signal<string|null>(null);
  readonly form=new FormGroup<CategoryForm>({name:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.maxLength(80)]}),parentId:new FormControl('',{nonNullable:true}),slug:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]}),description:new FormControl('',{nonNullable:true,validators:[Validators.maxLength(180)]}),order:new FormControl(1,{nonNullable:true,validators:[Validators.required,Validators.min(1)]}),visible:new FormControl(true,{nonNullable:true})});
  constructor(){inject(DestroyRef).onDestroy(()=>this.revokeImage());}
  choose(input:HTMLInputElement):void{input.click();} selectImage(event:Event):void{const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file?.type.startsWith('image/'))return;this.revokeImage();this.imageUrl.set(URL.createObjectURL(file));input.value='';}
  save():void{this.form.markAllAsTouched();if(this.form.invalid)return;const value=this.form.getRawValue();this.submitted.emit({...value,parentId:value.parentId||null});}
  close():void{this.closed.emit();} backdrop(event:MouseEvent):void{if(event.target===event.currentTarget)this.close();}
  private revokeImage():void{const url=this.imageUrl();if(url)URL.revokeObjectURL(url);this.imageUrl.set(null);}
}
