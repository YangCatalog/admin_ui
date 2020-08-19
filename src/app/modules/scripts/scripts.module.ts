import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptsRoutingModule } from './scripts-routing.module';
import { ScriptsComponent } from './pages/scripts/scripts.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LabelParserPipe } from './pipes/label-parser.pipe';
import { ScriptExecuteComponent } from './components/script-execute/script-execute.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobItemComponent } from './components/job-item/job-item.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { JobStatusCheckComponent } from './components/job-status-check/job-status-check.component';
import { SharedModule } from 'src/app/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue:
      {
        autoFocus: false,
        hasBackdrop: true,
        position: { top: '80px' },
        maxHeight: 'calc(100vh - 100px)'
      }
    }
  ],
  declarations: [ScriptsComponent, ConfirmComponent, LabelParserPipe, ScriptExecuteComponent, JobListComponent, JobItemComponent, JobStatusCheckComponent],
  imports: [
    CommonModule,
    ScriptsRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ClipboardModule,
    SharedModule,
    MatIconModule
  ]
})
export class ScriptsModule { }
