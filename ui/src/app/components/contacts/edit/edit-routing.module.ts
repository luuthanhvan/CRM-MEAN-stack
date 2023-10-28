import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditContactsComponent } from "./edit.component";

const routes: Routes = [
  {
    path: "",
    component: EditContactsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditContactRoutingModule {}
