import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditSalesOrderComponent } from "./edit.component";

const routes: Routes = [
  {
    path: "",
    component: EditSalesOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSalesOrderRoutingModule {}
