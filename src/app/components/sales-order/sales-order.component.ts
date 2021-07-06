import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SaleOrder } from '../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../services/sales_order/sales-order.service'; // use sale order service
import { dateFormat, datetimeFormat } from '../../helpers/datetime_format';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: "app-sales-order",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.scss"],
})
export class SalesOrderComponent implements OnInit {
	displayedColumns: string[] = [
		"no",
		"subject",
		"contactName",
		"status",
		"total",
		"assignedTo",
		"description",
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

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder,
				public dialog: MatDialog,
                private route: ActivatedRoute){
         
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

	// function to handle delete a sale order
	onDelete(saleOrderId: string, sub: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(SalesOrderConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${sub}"?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if(result){
                    // do confirmation action: delete the sales order
                    this.salesOrderService
                    	.deleteSaleOrder(saleOrderId)
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

	/*
	openDialog(dialogName : string){
        if(dialogName === 'createdTime'){
            let dialogRef = this.dialog.open(SalesOrderCreatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
            });
        }

        else if(dialogName === 'updatedTime'){
            let dialogRef = this.dialog.open(SalesOrderUpdatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
            });
        }
    } */
}

@Component({
    selector: 'sales-order-confirmation-dialog',
    templateUrl: 'confirmation-dialog.component.html'
})
export class SalesOrderConfirmationDialog{
    confirmMess : string;

    constructor(){}
}

/*
@Component({
    selector: 'sales-order-created-time-dialog',
    templateUrl: 'sales-order-created-time-dialog.component.html'
})
export class SalesOrderCreatedTimeDialogComponent implements OnInit {
    createdTimeForm : FormGroup;

    constructor(private formBuilder: FormBuilder){

    }

    ngOnInit() {
        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(''),
            createdTimeTo : new FormControl(''),
        });
    }
}

@Component({
    selector: 'sales-order-updated-time-dialog',
    templateUrl: 'sales-order-updated-time-dialog.component.html'
})
export class SalesOrderUpdatedTimeDialogComponent implements OnInit{
    
    updatedTimeForm : FormGroup;

    constructor(private formBuilder: FormBuilder){

    }

    ngOnInit() {
        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(''),
            updatedTimeTo : new FormControl(''),
        });
    }
} */
