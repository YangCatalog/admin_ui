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
  declarations: [ScriptsComponent, ConfirmComponent],
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
    MatInputModule
  ]
})
export class ScriptsModule { }