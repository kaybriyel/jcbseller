import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CakesPageRoutingModule } from './cakes-routing.module';

import { CakesPage } from './cakes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CakesPageRoutingModule
  ],
  declarations: [CakesPage]
})
export class CakesPageModule {}
