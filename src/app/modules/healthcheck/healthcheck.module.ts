import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthcheckBoardComponent } from './pages/healthcheck-board/healthcheck-board.component';
import { HealthcheckRoutingModule } from './healthcheck-routing.module';
import { MatCardModule } from '@angular/material/card';
import { HealthcheckCardComponent } from './components/healthcheck-card/healthcheck-card.component';
import { SharedModule } from 'src/app/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CronjobCardComponent } from './components/cronjob-card/cronjob-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ErrorMessageDialogComponent } from './dialogs/error-message-dialog/error-message-dialog.component';


@NgModule({
  declarations: [HealthcheckBoardComponent, HealthcheckCardComponent, CronjobCardComponent, ErrorMessageDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    HealthcheckRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HealthcheckModule { }
