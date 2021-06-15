import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SalesOrderService } from '../../../services/sales_order/sales-order.service';

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    
    saleOrderFormInfo: FormGroup; // typescript variable declaration

    constructor(private httpClient : HttpClient,
                protected salesOrderService: SalesOrderService){

    }

    ngOnInit(){
        this.saleOrderFormInfo = this.salesOrderService.prepareFormData();
    }

    // function to handle upload data from Sale order form to server
    onSubmit(form: FormGroup){
        let saleOrderInfo = this.salesOrderService.prepareDataToSubmit(form);
        
        this.httpClient
            .post(this.salesOrderService.SERVER_URL, saleOrderInfo)
            .subscribe(
                (res) => {
                    if(res['status'] == 1){
                        this.salesOrderService.gotoPage('/sales_order');
                    }
                }
            );
    }
}