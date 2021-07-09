import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service
import { ContactsService } from '../../../services/contacts/contacts.service';
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { snackbarConfig } from '../../../helpers/snackbar_config';

@Component({
    selector: 'app-edit-sales-order',
    templateUrl: './edit.component.html',
})
export class EditSalesOrderComponent implements OnInit {
    saleOrderFormInfo : FormGroup; // typescript variable declaration
    statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    contacts : Object;
    saleOrderId : string;
    createdTime : string;
    users : Object;
    submitted = false;

    // some variables for the the snackbar (a kind of toast message)
    successMessage : string = 'Success to save the sale order!';
    errorMessage : string = 'Failed to save the sale order!'
    label: string = '';
    setAutoHide: boolean = true;
    duration: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(private route: ActivatedRoute,
                protected router: Router,
                protected salesOrderService : SalesOrderService,
                private contactService : ContactsService,
                private userService : UserManagementService,
                public snackBar: MatSnackBar,
                private loadingService: LoadingService){
        
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
        saleOrderInfo.updatedTime = new Date();

        this.loadingService.showLoading();
        this.salesOrderService
            .updateSaleOrder(this.saleOrderId, saleOrderInfo)
            .subscribe((res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){ // status = 1 => OK
                    // show successful message
                    // display the snackbar belong with the indicator
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                    this.snackBar.open(this.successMessage, this.label, config);
                    this.router.navigate(['/sales_order']); // go back to the sales order page
                }
                else {
                    // show error message
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                    this.snackBar.open(this.errorMessage, this.label, config);
                }
            });
    }
}