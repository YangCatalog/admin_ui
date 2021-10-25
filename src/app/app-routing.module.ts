import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageGuard } from './others/guards/page.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/healthcheck'
  },
  {
    path: 'logs',
    loadChildren: () => import('./modules/logs-filter/logs-filter.module').then(mod => mod.LogsFilterModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'users-management',
    loadChildren: () => import('./modules/users-management/users-management.module').then(mod => mod.UsersManagementModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'config',
    loadChildren: () => import('./modules/config/config.module').then(mod => mod.ConfigModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'nginx-config',
    loadChildren: () => import('./modules/nginx/nginx.module').then(mod => mod.NginxModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'files',
    loadChildren: () => import('./modules/files/files.module').then(mod => mod.FilesModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'scripts',
    loadChildren: () => import('./modules/scripts/scripts.module').then(mod => mod.ScriptsModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: 'healthcheck',
    loadChildren: () => import('./modules/healthcheck/healthcheck.module').then(mod => mod.HealthcheckModule),
    canActivate: [PageGuard],
    canLoad: [PageGuard]
  },
  {
    path: '**',
    redirectTo: '/healthcheck'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
