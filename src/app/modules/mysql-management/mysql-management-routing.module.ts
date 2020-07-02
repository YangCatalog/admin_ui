import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MysqlComponent } from './pages/mysql/mysql.component';

const routes: Routes = [
    {
        path: '',
        component: MysqlComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MysqlRoutingModule {}
