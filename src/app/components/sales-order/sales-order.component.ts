import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { tap, map, switchMap, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SaleOrder } from '../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../services/sales_order/sales-order.service'; // use sale order service
import { User } from '../../interfaces/user';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { SalesOrderConfirmationDialog } from './delete-dialog/confirmation-dialog.component';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastMessageService } from '../../services/toast_message/toast-message.service';
import { SalesOrderDetailsDialog } from './sales-order-details/sales-order-details.component';

interface FilterCriteria {
    status?: string,
    assignedTo?: string,
    contactName?: string,
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
	statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    statusFromDashboard : string;

	createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    status: FormControl;
    searchText : FormControl;
    contactName: FormControl;
    assignedTo : FormControl;
    assignedToUsers : Observable<User[]>;

    salesOrders$ : Observable<SaleOrder[]>;
    search$ : Observable<SaleOrder[]>;
    result$ : Observable<any>;
    filterSubject : BehaviorSubject<FilterCriteria> = new BehaviorSubject<FilterCriteria>({});

    checkArray : string[] = [];
    isDisabled : boolean = true; // it used to show/hide the mass delete button

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder,
				public dialog: MatDialog,
                private route: ActivatedRoute,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService,
                private userService : UserManagementService){
         
        // clear params (status) before get all data
        this.router.navigateByUrl('/sales_order');
        // get status passed from dashboard page
        this.route.queryParams.subscribe((params) => {
            if(params['status']){
                this.statusFromDashboard = params['status'];
                this.status = new FormControl(this.statusFromDashboard);
            }
        });
    }

	ngOnInit() {
		this.init();
	}

    init(){
        this.searchText = new FormControl('');
        this.status = new FormControl('');
        this.assignedTo = new FormControl('');
        
        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(),
            createdTimeTo : new FormControl(),
        });

        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(),
            updatedTimeTo : new FormControl(),
        });
        
        this.assignedToUsers = this.userService.getUsers();
        
        this.search$ = this.searchText.valueChanges.pipe(
            startWith(''),
            tap((contactName) => { console.log(contactName) }),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((contactName) => contactName ? this.salesOrderService.searchSaleOrder(contactName) : of(null)),
            map(res => res && res['data'] && res['data'].salesOrder)
        );

        this.salesOrders$ = combineLatest([this.salesOrderService.getSalesOrder(), this.filterSubject, this.search$]).pipe(
            map(([salesOrder, { status, assignedTo, contactName }, searchResult]) => {
                const sourceData = searchResult ? searchResult : salesOrder;
                return sourceData.filter(d => {
                    return (status ? d.status === status : true) &&
                            (assignedTo ? d.assignedTo === assignedTo : true);
                })
            })
        )
    }

	// function to reset the table
	reset(){
        this.filterSubject.next({});
        this.init();
    }

	// navigate to the edit sale order page
	navigateToEdit(saleOrderId: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: saleOrderId },
		};
		this.router.navigate(["/sales_order/edit"], navigationExtras);
	}
    
	applySelectFilter(filterValue: string, filterBy: string){
        const currentFilterObj = this.filterSubject.getValue();
        this.filterSubject.next({...currentFilterObj, [filterBy]: filterValue });
    }

    onDelete(saleOrderId: string, sub: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${sub}"?`;
        dialogRef.afterClosed().pipe(
            tap(() => {this.loadingService.showLoading()}),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((result) => {
                if(!result){
                    return of(0);
                }
                return this.salesOrderService.deleteSaleOrder(saleOrderId).pipe(
                    tap((res) => {
                        if(res['status'] === 1){
                            // show successful message
                            // display the snackbar belong with the indicator
                            this.toastMessage.showInfo('Success to delete the sale order!');
                            this.reset();
                        }
                        else{
                            // show error message
                            this.toastMessage.showError('Failed to delete the sale order!');
                        }
                    })
                );
            }),
            tap(() => {this.loadingService.hideLoading()})
        );
	}

    onCheckboxClicked(e){
        this.isDisabled = false; // enable the Delete button
        if(e.target.checked){
            // add the checked value to array
            this.checkArray.push(e.target.value);
        }
        else{
            // remove the unchecked value from array
            this.checkArray.splice(this.checkArray.indexOf(e.target.value), 1);
        }

        // if there is no value in checkArray then disable the Delete button
        if(this.checkArray.length == 0){
            this.isDisabled = true;
        }
    }

    onMassDeleteBtnClicked(){
        const salesOrderIds = this.checkArray;
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the contacts?`;
        dialogRef.afterClosed().pipe(
            tap(() => {this.loadingService.showLoading()}),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((result) => {
                if(!result){
                    return of(0);
                }
                return this.salesOrderService.deleteSalesOrder(salesOrderIds).pipe(
                        tap((res) => {
                            if(res['status'] === 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                this.toastMessage.showInfo('Success to delete the sales order!');
                                this.reset();
                            }
                            else {
                                // show error message
                                this.toastMessage.showError('Failed to delete the sales order!');
                            }
                        })
                    )
                
            }),
            tap(() => {this.loadingService.hideLoading()})
        ).subscribe();
    }

    onClickedRow(salesOrderId : string){
        const salesOrder = this.salesOrderService.getSaleOrder(salesOrderId);

        let dialogRef = this.dialog.open(SalesOrderDetailsDialog, { disableClose : false, panelClass: 'customDialog'});
        dialogRef.componentInstance.salesOrder$ = salesOrder;
        dialogRef.afterClosed().subscribe();
    }
}
