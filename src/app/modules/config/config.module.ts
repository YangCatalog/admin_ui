import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './pages/config/config.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared.module';
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
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedModule
  ]
})
export class ConfigModule { }
