import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

/* ERROR: NullInjectorError: No provider for HttpClient when using HttpClient */
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http"; // FIX: import HttpClientModule
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatTableModule,
  MatIconModule,
  MatGridListModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule,
  MatDialogModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatMenuModule,
} from "@angular/material";
import { MatNativeDateModule } from "@angular/material/core";

/* ERROR NullInjectorError: StaticInjectorError(AppModule)[BaseChartDirective -> ThemeService]: 
      StaticInjectorError(Platform: core)[BaseChartDirective -> ThemeService]: 
      NullInjectorError: No provider for ThemeService! */
/* import ThemeService and put it in providers of NgModule */
import { ChartsModule, ThemeService } from "ng2-charts";

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  HomeComponent,
  HomeChangePasswordComponent,
} from "./components/home/home.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { ContactConfirmationDialog } from "./components/contacts/delete-dialog/confirmation-dialog.component";
import { ContactDetailsDialog } from "./components/contacts/contact-details/contact-details.component";
import { SalesOrderComponent } from "./components/sales-order/sales-order.component";
import { SalesOrderConfirmationDialog } from "./components/sales-order/delete-dialog/confirmation-dialog.component";
import { SalesOrderDetailsDialog } from "./components/sales-order/sales-order-details/sales-order-details.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ProgressSpinnerModule } from "./components/progress-spinner/progress-spinner.module";
import { SignupComponent } from './components/signup/signup.component';

const materials = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatListModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatTableModule,
  MatIconModule,
  MatGridListModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule,
  MatDialogModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatMenuModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    ContactConfirmationDialog,
    ContactDetailsDialog,
    DashboardComponent,
    SalesOrderComponent,
    SalesOrderConfirmationDialog,
    SalesOrderDetailsDialog,
    UserManagementComponent,
    LoginComponent,
    HomeComponent,
    HomeChangePasswordComponent,
    SignupComponent,
  ],
  entryComponents: [
    AppComponent,
    ContactsComponent,
    ContactConfirmationDialog,
    ContactDetailsDialog,
    DashboardComponent,
    SalesOrderComponent,
    SalesOrderConfirmationDialog,
    SalesOrderDetailsDialog,
    UserManagementComponent,
    LoginComponent,
    HomeComponent,
    HomeChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ProgressSpinnerModule,
    materials,
    // ngx-translate and the loader module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT (ahead of time) compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
