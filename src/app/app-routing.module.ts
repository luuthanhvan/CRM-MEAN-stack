import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './helpers/auth.guard';
import { OnlyAdminUsersGuard } from './helpers/admin-user.guard';

const routes: Routes = [
	// {
	// 	path: 'signin',
	// 	component: LoginComponent,
	// },
	{
		path: '',
		component: HomeComponent,
		// canActivate: [AuthGuard], // require for load sign-in page first
		children: [
			{ path: 'dashboard', component: DashboardComponent, },
			{ path: 'contacts',  component: ContactsComponent, },
			{ path: 'sales_order', component: SalesOrderComponent, },
			{ path: 'user_management', component: UserManagementComponent, /* canActivate: [OnlyAdminUsersGuard] */},
			{
				path: 'contacts/add',
				loadChildren: () => import('./components/contacts/add/add.module').then(m => m.AddContactModule),
				// loadChildren: './components/contacts/add/add.module#AddContactModule',
			},
			{
				path: 'contacts/edit',
				loadChildren: () => import('./components/contacts/edit/edit.module').then(m => m.EditContactModule),
				// loadChildren: './components/contacts/edit/edit.module#EditContactModule',
			},
			{
				path: 'sales_order/add',
				loadChildren: () => import('./components/sales-order/add/add.module').then(m => m.AddSaleOrderModule),
				// loadChildren: './components/sales-order/add/add.module#AddSaleOrderModule',
			},
			{
				path: 'sales_order/edit',
				loadChildren: () => import('./components/sales-order/edit/edit.module').then(m => m.EditSaleOrderModule),
				// loadChildren: './components/sales-order/edit/edit.module#EditSaleOrderModule',
			},
			{
				path: 'user_management/add',
				loadChildren: () => import('./components/user-management/add/add.module').then(m => m.AddUserModule),
				// loadChildren: './components/user-management/add/add.module#AddUserModule',
			},
			{
				path: 'user_management/edit',
				loadChildren: () => import('./components/user-management/edit/edit.module').then(m => m.EditUserModule),
				// loadChildren: './components/user-management/edit/edit.module#EditUserModule',
			},
		],
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
