import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CakesPage } from './cakes.page';

const routes: Routes = [
  {
    path: '',
    component: CakesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CakesPageRoutingModule {}
