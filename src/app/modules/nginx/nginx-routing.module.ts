import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NginxComponent } from './pages/nginx/nginx.component';


const routes: Routes = [
  {
      path: '',
      component: NginxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NginxRoutingModule { }
