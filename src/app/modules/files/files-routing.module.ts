import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilesOverviewComponent } from './pages/files-overview/files-overview.component';
import { FileEditComponent } from './pages/file-edit/file-edit.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: 'overview',
      pathMatch: 'full'
  },
  {
      path: 'overview',
      component: FilesOverviewComponent
  },
  {
    path: 'edit',
    component: FileEditComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }
