
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NginxRoutingModule } from './nginx-routing.module';
import { NginxComponent } from './pages/nginx/nginx.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
  declarations: [NginxComponent],
  imports: [
    CommonModule,
    NginxRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class NginxModule { }
