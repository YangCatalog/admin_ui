import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LogsFilterRoutingModule } from './logs-filter-routing.module';
import { LogsComponent } from './pages/logs/logs.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [LogsComponent],
    imports: [
        CommonModule,
        LogsFilterRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule
    ]
})
export class LogsFilterModule {}
