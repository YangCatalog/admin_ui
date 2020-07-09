import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MysqlComponent } from './pages/mysql/mysql.component';
import { MysqlRoutingModule } from './mysql-management-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RecordDialogComponent } from './dialogs/record-dialog/record-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';

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
  declarations: [MysqlComponent, RecordDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    MysqlRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule
  ]
})
export class MysqlManagementModule { }
