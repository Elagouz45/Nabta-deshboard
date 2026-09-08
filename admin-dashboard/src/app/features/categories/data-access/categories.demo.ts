import { Category } from '../models/category.models';
export const DEMO_CATEGORIES: readonly Category[] = [
  { id:'1',name:'أسمدة',description:'تصنيف رئيسي',icon:'♙',productCount:48,order:'1',visible:true,parentId:null },
  { id:'2',name:'أسمدة عضوية',description:'تصنيف فرعي',icon:'♧',productCount:24,order:'1.1',visible:true,parentId:'1' },
  { id:'3',name:'أسمدة معدنية',description:'تصنيف فرعي',icon:'♨',productCount:24,order:'1.2',visible:true,parentId:'1' },
  { id:'4',name:'بذور وشتلات',description:'تصنيف رئيسي',icon:'♧',productCount:36,order:'2',visible:true,parentId:null },
  { id:'5',name:'أدوات زراعية',description:'تصنيف رئيسي',icon:'⚒',productCount:18,order:'3',visible:true,parentId:null },
  { id:'6',name:'أنظمة الري',description:'تصنيف رئيسي',icon:'◯',productCount:12,order:'4',visible:true,parentId:null },
  { id:'7',name:'تربة ومحسنات',description:'تصنيف رئيسي',icon:'⌁',productCount:0,order:'5',visible:false,parentId:null },
];
