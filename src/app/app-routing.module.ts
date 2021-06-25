import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { ContactsComponent } from './components/home/contacts/contacts.component';
import { SalesOrderComponent } from './components/home/sales-order/sales-order.component';
import { UserManagementComponent } from './components/home/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './helpers/auth.guards';

const routes: Routes = [
	{
		path: 'signin',
		component: LoginComponent,
	},
	{
		path: '',
		component: HomeComponent,
		canActivate: [AuthGuard], // require for load sign-in page first
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		outlet : 'content',
	},
	{
		path: 'contacts', 
		component: ContactsComponent,
		canActivate: [AuthGuard],
		outlet : 'content',
	},
	{
		path: 'sales_order',
		component: SalesOrderComponent,
		canActivate: [AuthGuard],
		outlet : 'content',
	},
	{
		path: 'user_management',
		component: UserManagementComponent,
		canActivate: [AuthGuard],
		outlet : 'content',
	},
	// {
	// 	path: 'contacts/add',
	// 	// loadChildren: () => import('./components/contacts/add/add.module').then(m => m.AddContactModule),
	// 	loadChildren: './components/contacts/add/add.module#AddContactModule',
	// },
	// {
	// 	path: 'contacts/edit',
	// 	// loadChildren: () => import('./components/contacts/edit/edit.module').then(m => m.EditContactModule),
	// 	loadChildren: './components/contacts/edit/edit.module#EditContactModule',
	// },
	// {
	// 	path: 'sales_order/add',
	// 	loadChildren: './components/sales-order/add/add.module#AddSaleOrderModule',
	// },
	// {
	// 	path: 'sales_order/edit',
	// 	loadChildren: './components/sales-order/edit/edit.module#EditSaleOrderModule',
	// },
	// {
	// 	path: 'user_management/add',
	// 	loadChildren: './components/user-management/add/add.module#AddUserModule',
	// },
	// {
	// 	path: 'user_management/edit',
	// 	loadChildren: './components/user-management/edit/edit.module#EditUserModule',
	// },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
