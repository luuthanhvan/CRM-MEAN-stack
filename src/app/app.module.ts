import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* ERROR: NullInjectorError: No provider for HttpClient when using HttpClient */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // FIX: import HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule,
  MatDividerModule, MatFormFieldModule, MatDatepickerModule,
  MatTableModule, MatIconModule, MatGridListModule, MatSelectModule,
  MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTabsModule, MatDialogModule, MatCheckboxModule,
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';

/* ERROR NullInjectorError: StaticInjectorError(AppModule)[BaseChartDirective -> ThemeService]: 
      StaticInjectorError(Platform: core)[BaseChartDirective -> ThemeService]: 
      NullInjectorError: No provider for ThemeService! */
/* import ThemeService and put it in providers of NgModule */
import { ChartsModule, ThemeService } from 'ng2-charts';

import { HomeComponent, HomeChangePasswordComponent, } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactConfirmationDialog } from './components/contacts/delete-dialog/confirmation-dialog.component';
import { EditContactDialog } from './components/contacts/edit-dialog/contacts-edit-dialog.component';

import { SalesOrderComponent, } from './components/sales-order/sales-order.component';
import { SalesOrderConfirmationDialog } from './components/sales-order/delete-dialog/confirmation-dialog.component';
import { EditSaleOrderDialog } from './components/sales-order/edit-dialog/sales-order-edit-dialog.component';

import { UserManagementComponent } from './components/user-management/user-management.component';
import { EditUserDialog } from './components/user-management/edit-dialog/user-edit-dialog.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';

// overlay progress spinner
import { AppOverlayModule } from './overlay/overlay.module';
import { ProgressSpinnerModule } from './components/progress-spinner/progress-spinner.module';

const materials = [
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule, MatDividerModule,
  MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatTableModule, MatIconModule,
  MatGridListModule, MatSelectModule, MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTabsModule, MatDialogModule, MatCheckboxModule
];


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent, ContactConfirmationDialog, EditContactDialog,
    DashboardComponent,
    SalesOrderComponent, SalesOrderConfirmationDialog, EditSaleOrderDialog,
    UserManagementComponent, EditUserDialog,
    LoginComponent, 
    HomeComponent, HomeChangePasswordComponent,
    
  ],
  entryComponents : [
    AppComponent,
    ContactsComponent, ContactConfirmationDialog, EditContactDialog,
    DashboardComponent,
    SalesOrderComponent, SalesOrderConfirmationDialog, EditSaleOrderDialog,
    UserManagementComponent, EditUserDialog,
    LoginComponent, 
    HomeComponent, HomeChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    ChartsModule,
    materials,
    AppOverlayModule, ProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ThemeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
