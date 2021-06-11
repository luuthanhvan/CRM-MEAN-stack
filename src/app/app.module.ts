import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* ERROR: NullInjectorError: No provider for HttpClient when using HttpClient */
import { HttpClientModule } from '@angular/common/http'; // FIX: import HttpClientModule

import { 
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule,
  MatDividerModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
  MatTableModule, MatIconModule, MatGridListModule,
} from '@angular/material';

import { ContactsComponent } from './contacts/contacts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';

const materials = [
  MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule, MatDividerModule,
  MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatTableModule, MatIconModule,
  MatGridListModule,
];


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    DashboardComponent,
    SalesOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    materials,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
