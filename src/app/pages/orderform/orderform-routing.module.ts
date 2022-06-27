import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderformPage } from './orderform.page';

const routes: Routes = [
  {
    path: '',
    component: OrderformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderformPageRoutingModule {}
