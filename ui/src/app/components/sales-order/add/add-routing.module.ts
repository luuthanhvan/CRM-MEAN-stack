import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddSaleOrderComponent } from "./add.component";

const routes: Routes = [
  {
    path: "",
    component: AddSaleOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSaleOrderRoutingModule {}
