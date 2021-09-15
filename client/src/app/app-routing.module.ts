import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { LivePageComponent } from './pages/live-page/live-page.component';

const routes: Routes = [
  {
    path: '',
    component: EditPageComponent
  }, {
    path: 'live',
    component: LivePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
