import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SalesOrderService } from '../../../services/sales_order/sales-order.service';

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    
    saleOrderFormInfo: FormGroup; // typescript variable declaration
    
    SERVER_URL : String = 'http://localhost:4040/sales_order';

    constructor(private httpClient : HttpClient,
                protected salesOrderService: SalesOrderService){

    }

    ngOnInit(){
        this.saleOrderFormInfo = this.salesOrderService.prepareFormData();
    }

    onSubmit(form: FormGroup){
        this.httpClient
            .post(`${this.SERVER_URL}/store`, this.salesOrderService.prepareDataToSubmit(form))
            .subscribe(
                (res) => {
                    if(res['status'] == 1){
                        this.salesOrderService.gotoPage('/sales_order');
                    }
                }
            );
    }
}