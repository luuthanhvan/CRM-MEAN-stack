import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { 
    MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatButtonModule, MatGridListModule,
} from '@angular/material';
import { MatInputModule } from '@angular/material/input'; // import this to render form exactly
import { MatNativeDateModule } from '@angular/material/core'; // require when using MatDatepickerModule

import { AddSaleOrderComponent } from './add.component';
import { AddSaleOrderRoutingModule } from './add-routing.module';

const materials = [
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatGridListModule,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AddSaleOrderRoutingModule,
        materials,
    ],
    declarations: [ AddSaleOrderComponent ],
})
export class AddSaleOrderModule {
}