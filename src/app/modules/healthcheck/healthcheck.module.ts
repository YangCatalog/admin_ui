import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthcheckBoardComponent } from './pages/healthcheck-board/healthcheck-board.component';
import { HealthcheckRoutingModule } from './healthcheck-routing.module';
import { MatCardModule } from '@angular/material/card';
import { HealthcheckCardComponent } from './pages/healthcheck-card/healthcheck-card.component';
import { SharedModule } from 'src/app/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [HealthcheckBoardComponent, HealthcheckCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    HealthcheckRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class HealthcheckModule { }
