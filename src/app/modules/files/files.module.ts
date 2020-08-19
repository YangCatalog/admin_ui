import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FilesOverviewComponent } from './pages/files-overview/files-overview.component';
import { SharedModule } from 'src/app/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileEditComponent } from './pages/file-edit/file-edit.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { FolderComponent } from './components/folder/folder.component';
import { FileComponent } from './components/file/file.component';
import { BytesPipe } from './pipes/bytes.pipe';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { FilesSizeGraphComponent } from './pages/files-size-graph/files-size-graph.component';

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
  declarations: [FilesOverviewComponent, FileEditComponent, DeleteDialogComponent, FolderComponent, FileComponent, BytesPipe, PieChartComponent, FilesSizeGraphComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    SharedModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    ChartsModule
  ]
})
export class FilesModule { }
