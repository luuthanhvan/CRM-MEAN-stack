import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* ERROR: NullInjectorError: No provider for HttpClient when using HttpClient */
import { HttpClientModule } from '@angular/common/http'; // FIX: import HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule,
  MatDividerModule, MatFormFieldModule, MatDatepickerModule,
  MatTableModule, MatIconModule, MatGridListModule, MatSelectModule,
  MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule,
} from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';

/* ERROR NullInjectorError: StaticInjectorError(AppModule)[BaseChartDirective -> ThemeService]: 
      StaticInjectorError(Platform: core)[BaseChartDirective -> ThemeService]: 
      NullInjectorError: No provider for ThemeService! */
/* import ThemeService and put it in providers of NgModule */
import { ChartsModule, ThemeService } from 'ng2-charts';

import { ContactsComponent } from './components/contacts/contacts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const materials = [
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule, MatDividerModule,
  MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatTableModule, MatIconModule,
  MatGridListModule, MatSelectModule, MatInputModule, MatSlideToggleModule, MatProgressSpinnerModule
];


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    DashboardComponent,
    SalesOrderComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    ChartsModule,
    materials,
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
