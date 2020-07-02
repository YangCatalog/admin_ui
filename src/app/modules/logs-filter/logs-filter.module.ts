import { NgModule } from '@angular/core';
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
import { SharedModule } from 'src/app/shared.module';

@NgModule({
    declarations: [LogsComponent],
    imports: [
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
        MatPaginatorModule,
        SharedModule
    ]
})
export class LogsFilterModule {}
