import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HealthcheckBoardComponent } from './pages/healthcheck-board/healthcheck-board.component';

const routes: Routes = [
  {
    path: '',
    component: HealthcheckBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthcheckRoutingModule { }
