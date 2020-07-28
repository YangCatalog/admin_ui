import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LogsComponent } from './pages/logs/logs.component';

const routes: Routes = [
    {
        path: '',
        component: LogsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogsFilterRoutingModule {}
