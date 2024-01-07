import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { SalesOrderComponent } from "./components/sales-order/sales-order.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "signin",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard], // require for load sign-in page first
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "contacts", component: ContactsComponent },
      { path: "sales_order", component: SalesOrderComponent },
      { path: "user_management", component: UserManagementComponent },
      {
        path: "contacts/add",
        loadChildren: () =>
          import("./components/contacts/add/add.module").then(
            (m) => m.AddContactModule
          ),
      },
      {
        path: "contacts/edit",
        loadChildren: () =>
          import("./components/contacts/edit/edit.module").then(
            (m) => m.EditContactModule
          ),
      },
      {
        path: "sales_order/add",
        loadChildren: () =>
          import("./components/sales-order/add/add.module").then(
            (m) => m.AddSaleOrderModule
          ),
      },
      {
        path: "sales_order/edit",
        loadChildren: () =>
          import("./components/sales-order/edit/edit.module").then(
            (m) => m.EditSaleOrderModule
          ),
      },
      {
        path: "user_management/add",
        loadChildren: () =>
          import("./components/user-management/add/add.module").then(
            (m) => m.AddUserModule
          ),
      },
      {
        path: "user_management/edit",
        loadChildren: () =>
          import("./components/user-management/edit/edit.module").then(
            (m) => m.EditUserModule
          ),
      },
      {
        path: "**",
        redirectTo: "/dashboard",
        pathMatch: "full", // for page not found
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/signin",
    pathMatch: "full", // for page not found
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
