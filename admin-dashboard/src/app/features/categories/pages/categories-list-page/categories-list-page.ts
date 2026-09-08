import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideChevronLeft, LucideInfo, LucidePencil, LucidePlus, LucideSearch } from '@lucide/angular';
import { CategoryCreateDrawer } from '../../components/category-create-drawer/category-create-drawer';
import { CategoriesStore } from '../../data-access/categories.store';
import { CategoryFilters, CreateCategoryRequest } from '../../models/category.models';

@Component({selector:'app-categories-list-page',imports:[ReactiveFormsModule,LucideChevronLeft,LucideInfo,LucidePencil,LucidePlus,LucideSearch,CategoryCreateDrawer],providers:[CategoriesStore],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./categories-list-page.html',styleUrl:'./categories-list-page.scss'})
export class CategoriesListPage {readonly store=inject(CategoriesStore);readonly search=new FormControl('',{nonNullable:true});constructor(){this.search.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(search=>this.store.setFilters({search}));}setFilter(key:'visibility'|'level',value:string):void{this.store.setFilters({[key]:value as CategoryFilters[typeof key]});}add(request:CreateCategoryRequest):void{this.store.add(request);}}
