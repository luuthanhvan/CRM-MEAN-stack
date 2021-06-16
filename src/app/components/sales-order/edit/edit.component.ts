import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service

@Component({
    selector: 'app-edit-sales-order',
    templateUrl: './edit.component.html',
})
export class EditSalesOrderComponent implements OnInit {
    saleOrderFormInfo: FormGroup; // typescript variable declaration
    saleOrderId: string;
    createdTime: any;

    constructor(private route: ActivatedRoute,
                protected router: Router,
                protected salesOrderService : SalesOrderService){
        
        this.route.queryParams.subscribe((params) => {
            this.saleOrderId = params['id'];
        });

        this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
    }

    ngOnInit(){
        // load sale order information to the sale order form
        this.salesOrderService
            .getSaleOrder(this.saleOrderId)
            .subscribe((data) => {
                this.saleOrderFormInfo.setValue({
                    contactName: data.contactName,
                    subject: data.subject,
                    status: data.status,
                    total: data.total,
                    assignedTo: data.assignedTo,
                    description: data.description,
                });
                this.createdTime = data.createdTime; // to keep the created time when update new sale order info
            });
    }

    // function to handle update a sale order
    onUpdate(form: FormGroup){
        let saleOrderInfo = form.value;
        saleOrderInfo.createdTime = this.createdTime;
        saleOrderInfo.updatedTime = new Date(Date.now()).toLocaleString();

        this.salesOrderService
            .updateSaleOrder(this.saleOrderId, saleOrderInfo)
            .subscribe((res) => {
                if(res['status'] == 1) // status = 1 => OK
                    this.router.navigate(['/sales_order']); // go back to the sales order page
            });
    }
}