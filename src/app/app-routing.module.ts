import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';

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
    loadChildren: () => import('./contacts/add/add.module').then(m => m.AddContactModule),
  },
  {
    path: 'contacts/edit',
    loadChildren: () => import('./contacts/edit/edit.module').then(m => m.EditContactModule),
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
