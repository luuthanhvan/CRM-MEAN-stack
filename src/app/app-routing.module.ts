import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent,
	},
	{
		path: 'contacts', 
		component: ContactsComponent,
	},
	{
		path: 'sales_order',
		component: SalesOrderComponent,    
	},
	{
		path: 'user_management',
		component: UserManagementComponent,
	},
	{
		path: 'contacts/add',
		// loadChildren: () => import('./components/contacts/add/add.module').then(m => m.AddContactModule),
		loadChildren: './components/contacts/add/add.module#AddContactModule',
	},
	{
		path: 'contacts/edit',
		// loadChildren: () => import('./components/contacts/edit/edit.module').then(m => m.EditContactModule),
		loadChildren: './components/contacts/edit/edit.module#EditContactModule',
	},
	{
		path: 'sales_order/add',
		loadChildren: './components/sales-order/add/add.module#AddSaleOrderModule',
	},
	{
		path: 'sales_order/edit',
		loadChildren: './components/sales-order/edit/edit.module#EditSaleOrderModule',
	},
	{
		path: 'user_management/add',
		loadChildren: './components/user-management/add/add.module#AddUserModule',
	},
	{
		path: 'user_management/edit',
		loadChildren: './components/user-management/edit/edit.module#EditUserModule',
	},
	{
		path: '', redirectTo: 'dashboard', pathMatch: 'full',
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
