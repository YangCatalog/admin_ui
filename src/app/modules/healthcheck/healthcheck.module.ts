import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared.module';
import { CronjobCardComponent } from './components/cronjob-card/cronjob-card.component';
import { HealthcheckCardComponent } from './components/healthcheck-card/healthcheck-card.component';
import { ErrorMessageDialogComponent } from './dialogs/error-message-dialog/error-message-dialog.component';
import { InfoMessageDialogComponent } from './dialogs/info-message-dialog/info-message-dialog.component';
import { HealthcheckRoutingModule } from './healthcheck-routing.module';
import { HealthcheckBoardComponent } from './pages/healthcheck-board/healthcheck-board.component';


@NgModule({
  declarations: [HealthcheckBoardComponent, HealthcheckCardComponent, CronjobCardComponent, ErrorMessageDialogComponent, InfoMessageDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    HealthcheckRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ]
})
export class HealthcheckModule { }
