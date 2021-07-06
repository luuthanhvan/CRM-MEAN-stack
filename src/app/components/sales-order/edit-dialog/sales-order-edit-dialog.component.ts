import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service
import { ContactsService } from '../../../services/contacts/contacts.service';
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { SalesOrderConfirmationDialog } from '../delete-dialog/confirmation-dialog.component';

@Component({
    selector: 'edit-sale-order-dialog',
    templateUrl: 'sales-order-edit-dialog.component.html'
})
export class EditSaleOrderDialog implements OnInit{
    saleOrderFormInfo : FormGroup; // typescript variable declaration
    statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    contacts : Object;
    saleOrderId : string;
    createdTime : string;
    users : Object;
    submitted = false;

    constructor(private route: ActivatedRoute,
                protected router: Router,
                protected salesOrderService : SalesOrderService,
                private contactService : ContactsService,
                private userService : UserManagementService,
                public dialog: MatDialog,){
        
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
        saleOrderInfo.updatedTime = new Date();

        this.salesOrderService
            .updateSaleOrder(this.saleOrderId, saleOrderInfo)
            .subscribe();
    }

    onDelete(){
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${this.saleOrderFormInfo.value.subject}"?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if(result){
                    // do confirmation action: delete the sales order
                    this.salesOrderService
                    	.deleteSaleOrder(this.saleOrderId)
                    	.subscribe((res) => {
                    		if(res['status'] == 1) // status = 1 => OK
                    			location.reload(); // reload the sales order page
                    	});
                }
                else{
                    dialogRef = null;
                }
            }
        );
    }
}