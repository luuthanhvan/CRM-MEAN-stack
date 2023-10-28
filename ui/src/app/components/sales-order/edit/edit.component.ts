import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import {
  tap,
  switchMap,
  distinctUntilChanged,
  debounceTime,
} from "rxjs/operators";
import { Contact } from "../../../interfaces/contact";
import { User } from "../../../interfaces/user";
import { SalesOrderService } from "../../../services/sales_order/sales-order.service";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { UserManagementService } from "../../../services/user_management/user-management.service";
import { LoadingService } from "../../../services/loading/loading.service";
import { ToastMessageService } from "../../../services/toast_message/toast-message.service";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-edit-sales-order",
  templateUrl: "./edit.component.html",
})
export class EditSalesOrderComponent implements OnInit {
  saleOrderFormInfo: FormGroup; // typescript variable declaration
  statusNames: string[] = ["Created", "Approved", "Delivered", "Canceled"];
  saleOrderId: string;
  createdTime: string;
  users: Object;
  submitted = false;
  contacts$: Observable<Contact[]>;
  assignedToUsers$: Observable<User[]>;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    protected salesOrderService: SalesOrderService,
    private contactService: ContactsService,
    private userService: UserManagementService,
    private loadingService: LoadingService,
    private toastMessage: ToastMessageService,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.saleOrderId = params["id"];
    });

    this.saleOrderFormInfo = this.salesOrderService.initSaleOrder();
    // get list of contacts name from database and display them to the Contact name field in saleOrderForm
    this.contacts$ = this.contactService.getContacts();
    // get list of users from database and display them to the Assigned field in saleOrderForm
    this.assignedToUsers$ = this.authService.getUser().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((user) => {
        if (!user.isAdmin) {
          return of(null);
        }
        return this.userService.getUsers();
      })
    );
  }

  ngOnInit() {
    // load sale order information to the sale order form
    this.salesOrderService
      .getSaleOrder(this.saleOrderId)
      .pipe(
        tap((data) => {
          this.saleOrderFormInfo.setValue({
            contactName: data.contactName,
            subject: data.subject,
            status: data.status,
            total: data.total,
            assignedTo: data.assignedTo,
            description: data.description,
          });
          this.createdTime = data.createdTime; // to keep the created time when update new sale order info
        })
      )
      .subscribe();
  }

  get saleOrderFormControl() {
    return this.saleOrderFormInfo.controls;
  }

  // function to handle update a sale order
  onUpdate(form: FormGroup) {
    let saleOrderInfo = form.value;
    saleOrderInfo.createdTime = this.createdTime;
    saleOrderInfo.updatedTime = new Date();

    this.loadingService.showLoading();
    this.salesOrderService
      .updateSaleOrder(this.saleOrderId, saleOrderInfo)
      .pipe(
        tap((res) => {
          this.loadingService.hideLoading();
          if (res["status"] == 1) {
            // status = 1 => OK
            // show successful message
            // display the snackbar belong with the indicator
            this.toastMessage.showInfo("Success to save the sale order!");
            this.router.navigate(["/sales_order"]); // go back to the sales order page
          } else {
            // show error message
            this.toastMessage.showError("Failed to save the sale order!");
          }
        })
      )
      .subscribe();
  }
}
