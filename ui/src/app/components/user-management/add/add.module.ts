import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import {
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatButtonModule,
  MatGridListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
} from "@angular/material";
import { MatInputModule } from "@angular/material/input"; // import this to render form exactly
import { MatNativeDateModule } from "@angular/material/core"; // require when using MatDatepickerModule

import { AddUserComponent } from "./add.component";
import { AddUserRoutingModule } from "./add-routing.module";

const materials = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatGridListModule,
  MatCheckboxModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddUserRoutingModule,
    materials,
  ],
  declarations: [AddUserComponent],
})
export class AddUserModule {}
