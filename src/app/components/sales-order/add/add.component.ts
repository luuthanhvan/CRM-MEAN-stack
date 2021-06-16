import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    
    saleOrderFormInfo: FormGroup; // typescript variable declaration

    constructor(protected router : Router,
                protected salesOrderService: SalesOrderService){}

    ngOnInit(){
        this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
    }

    // function to handle upload data from Sale order form to server
    onSubmit(form: FormGroup){
        let saleOrderInfo = form.value;
        saleOrderInfo.createdTime = new Date(Date.now()).toLocaleString();
        saleOrderInfo.updatedTime = new Date(Date.now()).toLocaleString();

        this.salesOrderService
            .addSaleOrder(saleOrderInfo)
            .subscribe((res) => {
                if(res['status'] == 1) // status = 1 => OK
                    this.router.navigate(['/sales_order']); // go back to the sales order page
            });
    }
}