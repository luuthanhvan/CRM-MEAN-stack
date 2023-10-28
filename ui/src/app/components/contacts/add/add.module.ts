import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatButtonModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
} from "@angular/material";
import { MatInputModule } from "@angular/material/input"; // import this to render form exactly
import { MatNativeDateModule } from "@angular/material/core"; // require when using MatDatepickerModule

import { AddContactComponent } from "./add.component";
import { AddContactRoutingModule } from "./add-routing.module";

import { ProgressSpinnerModule } from "../../progress-spinner/progress-spinner.module"; // overlay progress bar

const materials = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AddContactRoutingModule,
    materials,
    ProgressSpinnerModule,
  ],
  declarations: [AddContactComponent],
})
export class AddContactModule {}
