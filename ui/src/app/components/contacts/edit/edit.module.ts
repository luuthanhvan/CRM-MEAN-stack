import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import {
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
} from "@angular/material";
import { MatInputModule } from "@angular/material/input"; // import this to render form exactly
import { MatNativeDateModule } from "@angular/material/core"; // require when using MatDatepickerModule

import { EditContactsComponent } from "./edit.component";
import { EditContactRoutingModule } from "./edit-routing.module";

const materials = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditContactRoutingModule,
    materials,
  ],
  declarations: [EditContactsComponent],
})
export class EditContactModule {}
