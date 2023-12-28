import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable, BehaviorSubject, of, combineLatest } from "rxjs";
import {
  tap,
  map,
  switchMap,
  startWith,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import { SaleOrder } from "../../interfaces/sale-order";
import { User } from "../../interfaces/user";
import { SalesOrderService } from "../../services/sales_order/sales-order.service";
import { UserManagementService } from "../../services/user_management/user-management.service";
import { LoadingService } from "../../services/loading/loading.service";
import { ToastMessageService } from "../../services/toast_message/toast-message.service";
import { DatetimeService } from "../../services/datetime/datetime.service";
import { AuthService } from "../../services/auth/auth.service";
import { SalesOrderConfirmationDialog } from "./delete-dialog/confirmation-dialog.component";
import { SalesOrderDetailsDialog } from "./sales-order-details/sales-order-details.component";
import { DateRangeValidator } from "../../helpers/validation_functions";

interface FilterCriteria {
  status?: string;
  assignedTo?: string;
  contactName?: string;
  createdTimeFrom?: object;
  createdTimeTo?: object;
  updatedTimeFrom?: object;
  updatedTimeTo?: object;
}

@Component({
  selector: "app-sales-order",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.scss"],
})
export class SalesOrderComponent implements OnInit {
  displayedColumns: string[] = [
    "check",
    "subject",
    "contactName",
    "status",
    "total",
    "assignedTo",
    "createdTime",
    "updatedTime",
    "modify",
    "delete",
  ];
  statusNames: string[] = ["Created", "Approved", "Delivered", "Canceled"];
  statusFromDashboard: string;

  createdTimeForm: FormGroup;
  updatedTimeForm: FormGroup;
  // status form controls will used for autofill when user click on sales order chart
  // so it need to be globally assigned a value
  status: FormControl = new FormControl("");
  searchText: FormControl;
  contactName: FormControl;
  assignedTo: FormControl;

  user$: Observable<User>;
  assignedToUsers$: Observable<User[]>;
  salesOrders$: Observable<SaleOrder[]>;
  search$: Observable<SaleOrder[]>;
  result$: Observable<SaleOrder[]>;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});

  checkArray: string[] = [];
  isDisabled: boolean = true; // it used to show/hide the mass delete button
  submitted: boolean = false;
  show: boolean = true;

  constructor(
    private router: Router,
    protected salesOrderService: SalesOrderService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastMessage: ToastMessageService,
    private userService: UserManagementService,
    protected datetimeService: DatetimeService,
    private authService: AuthService
  ) {
    // clear params (status) before get all data
    this.router.navigateByUrl("/sales_order");
    // get status passed from dashboard page
    this.route.queryParams.subscribe((params) => {
      if (params["status"]) {
        this.statusFromDashboard = params["status"];
        this.status = new FormControl(this.statusFromDashboard);
        this.applySelectFilter(this.status.value, "status");
      }
    });
  }

  ngOnInit() {
    this.init();

    // init created time and updated time form groups
    this.createdTimeForm = this.formBuilder.group(
      {
        createdTimeFrom: new FormControl(Validators.required),
        createdTimeTo: new FormControl(Validators.required),
      },
      { validators: DateRangeValidator("createdTimeFrom", "createdTimeTo") }
    );

    this.updatedTimeForm = this.formBuilder.group(
      {
        updatedTimeFrom: new FormControl(Validators.required),
        updatedTimeTo: new FormControl(Validators.required),
      },
      { validators: DateRangeValidator("updatedTimeFrom", "updatedTimeTo") }
    );

    const draft = window.localStorage.getItem("sales_order");
    if (draft) {
      this.router.navigateByUrl("/sales_order/add");
    }
  }

  init() {
    this.searchText = new FormControl("");
    this.assignedTo = new FormControl("");

    this.assignedToUsers$ = this.userService.getUsers().pipe(
      tap((data) => {
        if (data.length == 1) {
          this.show = false;
        }
      })
    );

    this.search$ = this.searchText.valueChanges.pipe(
      startWith(""),
      tap((contactName) => {
        console.log(contactName);
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((contactName) =>
        contactName
          ? this.salesOrderService.searchSaleOrder(contactName)
          : of(null)
      ),
      map((res) => res && res["data"] && res["data"].salesOrder)
    );

    this.result$ = combineLatest([
      this.salesOrderService.getSalesOrder(),
      this.filterSubject,
      this.search$,
    ]).pipe(
      map(
        ([
          salesOrder,
          {
            status,
            assignedTo,
            contactName,
            createdTimeFrom,
            createdTimeTo,
            updatedTimeFrom,
            updatedTimeTo,
          },
          searchResult,
        ]) => {
          const sourceData = searchResult ? searchResult : salesOrder;
          return sourceData.filter((d) => {
            return (
              (status ? d.status === status : true) &&
              (assignedTo ? d.assignedTo === assignedTo : true) &&
              (createdTimeFrom
                ? new Date(this.datetimeService.dateFormat(d.createdTime)) >=
                  createdTimeFrom
                : true) &&
              (createdTimeTo
                ? new Date(this.datetimeService.dateFormat(d.createdTime)) <=
                  createdTimeTo
                : true) &&
              (updatedTimeFrom
                ? new Date(this.datetimeService.dateFormat(d.updatedTime)) >=
                  updatedTimeFrom
                : true) &&
              (updatedTimeTo
                ? new Date(this.datetimeService.dateFormat(d.updatedTime)) <=
                  updatedTimeTo
                : true)
            );
          });
        }
      )
    );
  }

  // function to reset the table
  reset() {
    this.filterSubject.next({});
    this.init();
    this.status = new FormControl("");
    // reset form groups
    this.createdTimeForm.reset();
    this.updatedTimeForm.reset();
  }

  // navigate to the edit sale order page
  navigateToEdit(saleOrderId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { id: saleOrderId },
    };
    this.router.navigate(["/sales_order/edit"], navigationExtras);
  }

  applySelectFilter(filterValue: string, filterBy: string) {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilterObj, [filterBy]: filterValue });
  }

  applyDateFilter(dateForm: FormGroup, filterBy: string) {
    this.submitted = true;
    const date = dateForm.value;
    const currentFilterObj = this.filterSubject.getValue();

    if (filterBy == "createdTime") {
      let dateFrom = new Date(
          this.datetimeService.dateFormat(date.createdTimeFrom)
        ),
        dateTo = new Date(this.datetimeService.dateFormat(date.createdTimeTo));

      this.filterSubject.next({
        ...currentFilterObj,
        ["createdTimeFrom"]: dateFrom,
        ["createdTimeTo"]: dateTo,
      });
    }
    if (filterBy == "updatedTime") {
      let dateFrom = new Date(
          this.datetimeService.dateFormat(date.updatedTimeFrom)
        ),
        dateTo = new Date(this.datetimeService.dateFormat(date.updatedTimeTo));

      this.filterSubject.next({
        ...currentFilterObj,
        ["updatedTimeFrom"]: dateFrom,
        ["updatedTimeTo"]: dateTo,
      });
    }
  }

  onDelete(saleOrderId: string, sub: string) {
    // show confirmation dialog before detele an item
    let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, {
      disableClose: false,
    });
    dialogRef.componentInstance.confirmMess = `You want to delete the "${sub}"?`;
    dialogRef.afterClosed().pipe(
      tap(() => {
        this.loadingService.showLoading();
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((result) => {
        if (!result) {
          return of(0);
        }
        return this.salesOrderService.deleteSaleOrder(saleOrderId).pipe(
          tap((res) => {
            if (res["status"] === 1) {
              // show successful message
              // display the snackbar belong with the indicator
              this.toastMessage.showInfo("Success to delete the sale order!");
              this.reset();
            } else {
              // show error message
              this.toastMessage.showError("Failed to delete the sale order!");
            }
          })
        );
      }),
      tap(() => {
        this.loadingService.hideLoading();
      })
    );
  }

  onCheckboxClicked(e) {
    this.isDisabled = false; // enable the Delete button
    if (e.target.checked) {
      // add the checked value to array
      this.checkArray.push(e.target.value);
    } else {
      // remove the unchecked value from array
      this.checkArray.splice(this.checkArray.indexOf(e.target.value), 1);
    }

    // if there is no value in checkArray then disable the Delete button
    if (this.checkArray.length == 0) {
      this.isDisabled = true;
    }
  }

  onMassDeleteBtnClicked() {
    const salesOrderIds = this.checkArray;
    // show confirmation dialog before detele an item
    let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, {
      disableClose: false,
    });
    dialogRef.componentInstance.confirmMess = `You want to delete the contacts?`;
    dialogRef
      .afterClosed()
      .pipe(
        tap(() => {
          this.loadingService.showLoading();
        }),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((result) => {
          if (!result) {
            return of(0);
          }
          return this.salesOrderService.deleteSalesOrder(salesOrderIds).pipe(
            tap((res) => {
              if (res["status"] === 1) {
                // status = 1 => OK
                // show successful message
                // display the snackbar belong with the indicator
                this.toastMessage.showInfo(
                  "Success to delete the sales order!"
                );
                this.reset();
              } else {
                // show error message
                this.toastMessage.showError(
                  "Failed to delete the sales order!"
                );
              }
            })
          );
        }),
        tap(() => {
          this.loadingService.hideLoading();
        })
      )
      .subscribe();
  }

  onClickedRow(salesOrderId: string) {
    const salesOrder = this.salesOrderService.getSaleOrder(salesOrderId);

    let dialogRef = this.dialog.open(SalesOrderDetailsDialog, {
      disableClose: false,
      panelClass: "customDialog",
    });
    dialogRef.componentInstance.salesOrder$ = salesOrder;
    dialogRef.afterClosed().subscribe();
  }
}
