import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';

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
		path: 'sales_order',
		component: SalesOrderComponent,    
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
		path: '', redirectTo: 'dashboard', pathMatch: 'full',
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
