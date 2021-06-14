import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { SalesOrderService } from '../../../services/sales_order/sales-order.service';

@Component({
    selector: 'app-edit-sales-order',
    templateUrl: './edit.component.html',
})
export class EditSalesOrderComponent implements OnInit {
    saleOrderFormInfo: FormGroup; // typescript variable declaration
    saleOrderId: string;
    createdTime: any;

    constructor(private httpClient : HttpClient, 
                private route: ActivatedRoute,
                protected salesOrderService : SalesOrderService){
        
        this.route.queryParams.subscribe((params) => {
            this.saleOrderId = params['id'];
        });

        this.saleOrderFormInfo = this.salesOrderService.prepareFormData();
    }

    ngOnInit(){
        this.httpClient
            .get(`${this.salesOrderService.SERVER_URL}/${this.saleOrderId}`)
            .pipe(map(res => res['data']['saleOrder']))
            .subscribe(
                (res) => {
                    this.salesOrderService.setSaleOrderInfo(this.saleOrderFormInfo, res);
                    this.createdTime = res.createdTime; // to keep the created time when update new sale order info
                }
            );
    }

    onSubmit(form: FormGroup){
        let saleOrderInfo = this.salesOrderService.prepareDataToSubmit(form, this.createdTime)

        this.httpClient
            .put(`${this.salesOrderService.SERVER_URL}/${this.saleOrderId}`, saleOrderInfo)
            .subscribe(
                (res) => {
                    if(res['status'] == 1)
                        this.salesOrderService.gotoPage('/sales_order');
                }
            );   
    }
}