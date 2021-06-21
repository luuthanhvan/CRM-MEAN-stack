import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service
import { ContactsService } from '../../../services/contacts/contacts.service';
import { UserManagementService } from '../../../services/user_management/user-management.service';

@Component({
    selector: 'app-edit-sales-order',
    templateUrl: './edit.component.html',
})
export class EditSalesOrderComponent implements OnInit {
    saleOrderFormInfo : FormGroup; // typescript variable declaration
    statusNames: any[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    contacts : any;
    saleOrderId : string;
    createdTime : any;
    users : any;
    submitted = false;

    constructor(private route: ActivatedRoute,
                protected router: Router,
                protected salesOrderService : SalesOrderService,
                private contactService : ContactsService,
                private userService : UserManagementService){
        
        this.route.queryParams.subscribe((params) => {
            this.saleOrderId = params['id'];
        });

        this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
        // get list of contacts name from database and display them to the Contact name field in saleOrderForm
        this.contactService
            .getContacts()
            .subscribe((data) => {
                this.contacts = data.map((value) => {
                    return {contactId : value._id,
                            contactName: value.contactName};
                });
            });
        
        // get list of users from database and display them to the Assigned field in saleOrderForm
        this.userService
            .getUsers()
            .subscribe((data) => {
                this.users = data.map((value) => {
                    return {userId: value._id,
                            name: value.name};
                });
            });
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

    get saleOrderFormControl(){
        return this.saleOrderFormInfo.controls;
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