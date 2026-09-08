import{Routes}from'@angular/router';import{adminGuard}from'../../core/auth.guards';
export const TEAM_ROUTES:Routes=[
  {path:'',pathMatch:'full',redirectTo:'users'},
  {path:'users',canActivate:[adminGuard],title:'المستخدمون | نبته',loadComponent:()=>import('./pages/team-users-page/team-users-page').then(m=>m.TeamUsersPage)},
  {path:'roles',canActivate:[adminGuard],title:'الأدوار والصلاحيات | نبته',loadComponent:()=>import('./pages/team-roles-page/team-roles-page').then(m=>m.TeamRolesPage)},
  {path:'activity-log',canActivate:[adminGuard],title:'سجل نشاط الفريق | نبته',loadComponent:()=>import('./pages/team-activity-page/team-activity-page').then(m=>m.TeamActivityPage)},
];
