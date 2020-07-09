import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './others/login/login.component';
import { AuthGuard } from './others/guards/auth.guard';
import { PageGuard } from './others/guards/page.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/login'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'logs',
        loadChildren: () => import('./modules/logs-filter/logs-filter.module').then(mod => mod.LogsFilterModule),
        canActivate: [PageGuard],
        canLoad: [PageGuard]
    },
    {
        path: 'mysql-management',
        loadChildren: () => import('./modules/mysql-management/mysql-management.module').then(mod => mod.MysqlManagementModule),
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
        path: 'home',
        component: HomeComponent,
        canActivate: [PageGuard],
        canLoad: [PageGuard]
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
