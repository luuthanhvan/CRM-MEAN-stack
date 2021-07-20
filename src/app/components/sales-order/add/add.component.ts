import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Contact } from '../../../interfaces/contact';
import { User } from '../../../interfaces/user';
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sales order service
import { ContactsService } from '../../../services/contacts/contacts.service';
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastMessageService } from '../../../services/toast_message/toast-message.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    saleOrderFormInfo : FormGroup; // typescript variable declaration
    users : Object;
    submitted = false;
    contacts$ : Observable<Contact[]>;
    assignedToUsers : Observable<User[]>;

    constructor(protected router : Router,
                protected salesOrderService: SalesOrderService,
                private contactService : ContactsService,
                private userService : UserManagementService,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService,
                private authService : AuthService){}

    ngOnInit(){
        this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
        // get list of contacts name from database and display them to the Contact name field in saleOrderForm
        this.contacts$ = this.contactService.getContacts();
        // get list of users from database and display them to the Assigned field in saleOrderForm
        this.assignedToUsers = combineLatest([this.userService.getUsers(), this.authService.me()]).pipe(
            map(([users, user]) => {
                if(!user.isAdmin){
                    return [user];
                }
                return users;
            })
        );
    }

    get saleOrderFormControl(){
        return this.saleOrderFormInfo.controls;
    }

    // function to handle upload data from Sale order form to server
    onSubmit(form: FormGroup){
        this.submitted = true;
        let saleOrderInfo = form.value;
        saleOrderInfo.createdTime = new Date();
        saleOrderInfo.updatedTime = new Date();

        this.loadingService.showLoading();
        this.salesOrderService
            .addSaleOrder(saleOrderInfo)
            .pipe(
                tap((res) => {
                    this.loadingService.hideLoading();
                    if(res['status'] == 1){ // status = 1 => OK
                        // show successful message
                        // display the snackbar belong with the indicator
                        this.toastMessage.showInfo('Success to add a new sale order!');
                        this.router.navigate(['/sales_order']); // go back to the sales order page
                    }
                    else {
                        // show error message
                        this.toastMessage.showError('Failed to add a new sale order!');
                    }
                })
            ).subscribe();
    }
}