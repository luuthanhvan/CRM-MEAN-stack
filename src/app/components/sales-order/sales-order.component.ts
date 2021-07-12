import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SaleOrder } from '../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../services/sales_order/sales-order.service'; // use sale order service
import { dateFormat, datetimeFormat } from '../../helpers/datetime_format';
import { MatTableDataSource } from '@angular/material';
import { SalesOrderConfirmationDialog } from './delete-dialog/confirmation-dialog.component';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastMessageService } from '../../services/toast_message/toast-message.service';

@Component({
  selector: "app-sales-order",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.scss"],
})
export class SalesOrderComponent implements OnInit {
	displayedColumns: string[] = [
		// "no",
        "check",
		"subject",
		"contactName",
		"status",
		"total",
		"assignedTo",
		// "description",
		"createdTime",
		"updatedTime",
		"modify",
		"delete",
	];
 	dataSource: SaleOrder[] = []; // original datasource - array of objects
	dataArray : SaleOrder[] = []; // duplicate datasource, purpose: save the original datasource for filter

	data = new MatTableDataSource(); // data displayed in the table

	statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    status: FormControl = new FormControl('');
    statusFromDashboard : string;

	createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    searchControl : FormControl = new FormControl();

    checkArray : string[] = [];
    isDisabled : boolean = true; // it used to show/hide the mass delete button

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder,
				public dialog: MatDialog,
                private route: ActivatedRoute,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService){
         
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
		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
				this.dataSource = data.map((value, index) => {
					value.no = index+1;
					value.createdTime = datetimeFormat(value.createdTime);
					value.updatedTime = datetimeFormat(value.updatedTime);
					return value;
				});
                this.dataArray = this.dataSource; // store the original datasource

                // filter automately
                // if status (a param) got from dashboard, then filter the datasource by the leadSrc
                if(this.statusFromDashboard != undefined)
                    this.dataSource = data.filter(value => value.status === this.statusFromDashboard);

                // assign the datasource to data displayed in the table
				this.data = new MatTableDataSource(this.dataSource);
                this.dataSource = this.dataArray; // restore the datasource
			});
		
		this.createdTimeForm = this.formBuilder.group({
			createdTimeFrom : new FormControl(),
			createdTimeTo : new FormControl(),
		});

		this.updatedTimeForm = this.formBuilder.group({
			updatedTimeFrom : new FormControl(),
			updatedTimeTo : new FormControl(),
		});
	}

	// function to handle cancel filter sales order event
	onCancel(){
        // get list of sales order
		this.salesOrderService
            .getSalesOrder()
            .subscribe((data) => {
                this.dataSource = data.map((value, index) => {
                    value.no = index+1;
                    value.createdTime = datetimeFormat(value.createdTime);
                    value.updatedTime = datetimeFormat(value.updatedTime);
                    return value;
                });
                this.dataArray = this.dataSource; // store the original datasource

                // assign the datasource to data displayed in the table
                this.data = new MatTableDataSource(this.dataSource);
            });
        
        // reset form controls
        this.status = new FormControl();
        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(),
            createdTimeTo : new FormControl(),
        });

        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(),
            updatedTimeTo : new FormControl(),
        });
    }

	// navigate to the edit sale order page
	navigateToEdit(saleOrderId: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: saleOrderId },
		};
		this.router.navigate(["/sales_order/edit"], navigationExtras);
	}
    
	applySelectFilter(filterValue: string){
        this.dataSource =  this.dataSource.filter(value => value.status === filterValue);
        
        this.data = new MatTableDataSource(this.dataSource);
        this.dataSource = this.dataArray;
    }

	applyDateFilter(form: FormGroup, filter: string){

        if(filter === 'createdTime'){
            // format date and convert it to date object
            let fromDate = new Date(dateFormat(form.value.createdTimeFrom)),
            toDate = new Date(dateFormat(form.value.createdTimeTo));

            this.dataSource = this.dataSource.filter((value) => { 
                // get date from createdTime and convert it to date object
                let createdTime = new Date(value.createdTime.substring(0, value.createdTime.indexOf(', ')));
                return createdTime >= fromDate && createdTime <= toDate;
            });
        }

        if(filter === 'updatedTime'){
            let fromDate = new Date(dateFormat(form.value.updatedTimeFrom)),
            toDate = new Date(dateFormat(form.value.updatedTimeTo));

            this.dataSource = this.dataSource.filter((value) => { 
                let updatedTime = new Date(value.updatedTime.substring(0, value.updatedTime.indexOf(', ')));
                return updatedTime >= fromDate && updatedTime <= toDate;
            });
        }

        this.data = new MatTableDataSource(this.dataSource);
        this.dataSource = this.dataArray;
    }

	applySearch(form: FormControl){
        let contactName = form.value;
        let result : SaleOrder[] = [];
        for(let i = 0; i < this.dataSource.length; i++){
            if(this.dataSource[i].contactName === contactName){
                result.push(this.dataSource[i]);
            }
        }

        this.data = new MatTableDataSource(result);
    }

	clearSearch(){
        this.data = new MatTableDataSource(this.dataArray);
        this.searchControl = new FormControl('');
    }

    onDelete(saleOrderId: string, sub: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${sub}"?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if(result){
                    this.loadingService.showLoading();
                    // do confirmation action: delete the sales order
                    this.salesOrderService
                    	.deleteSaleOrder(saleOrderId)
                    	.subscribe((res) => {
                            this.loadingService.hideLoading();
                    		if(res['status'] == 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                this.toastMessage.showInfo('Success to delete the sale order!');
                    			location.reload(); // reload the sales order page
                            }
                            else {
                                // show error message
                                this.toastMessage.showError('Failed to delete the sale order!');
                            }
                    	});
                }
                else{
                    dialogRef = null;
                }
            }
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
        dialogRef.afterClosed().subscribe(
            (result) => {
                this.loadingService.showLoading();
                if(result){
                    // do confirmation action: delete the contact
                    this.salesOrderService
                        .deleteSalesOrder(salesOrderIds)
                        .subscribe((res) => {
                            this.loadingService.hideLoading();
                            if(res['status'] == 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                this.toastMessage.showInfo('Success to delete the sales order!');
                                window.location.reload(); // reload contacts page
                            }
                            else {
                                // show error message
                                this.toastMessage.showError('Failed to delete the sales order!');
                            }
                        });
                }
                else{
                    dialogRef = null;
                }
            }
        )
    }

    // onClickedRow(row : SaleOrder){
    //     let dialogRef = this.dialog.open(EditSaleOrderDialog, { disableClose : false, panelClass: 'formDialog' });
    //     dialogRef.componentInstance.saleOrderId = row._id;
    //     dialogRef.afterClosed().subscribe(
    //         (result) => {
    //             if(result){
    //                 window.location.reload();
    //             }
    //             else {
    //                 dialogRef = null;
    //             }
    //         }
    //     );
    // }
}
