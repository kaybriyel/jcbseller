import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'cakes',
        loadChildren: () => import('../pages/cakes/cakes.module').then(m => m.CakesPageModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('../pages/forms/forms.module').then(m => m.FormsPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../pages/notifications/notifications.module'​).then(m => m.NotificationsPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/cakes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
