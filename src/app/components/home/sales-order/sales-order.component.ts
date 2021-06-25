import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SaleOrder } from '../../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../../services/sales_order/sales-order.service'; // use sale order service
import { dateFormat, datetimeFormat } from '../../../helpers/datetime_format';
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
 	dataSource: SaleOrder[] = [];
	dataArray : SaleOrder[] = []; // duplicate datasource, purpose: save the original datasource for filter

	data = new MatTableDataSource();

	statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];

	createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    searchControl : FormControl = new FormControl();

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder,
				public dialog: MatDialog,){
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

				this.data = new MatTableDataSource(this.dataSource);
				this.dataArray = this.dataSource;
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
        location.reload();
    }

	// navigate to the edit sale order page
	navigateToEdit(saleOrderId: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: saleOrderId },
		};
		this.router.navigate(["/sales_order/edit"], navigationExtras);
	}

	// function to handle delete a sale order
	onDelete(saleOrderId: string) {
		this.salesOrderService
			.deleteSaleOrder(saleOrderId)
			.subscribe((res) => {
				if(res['status'] == 1) // status = 1 => OK
					location.reload(); // reload the sales order page
			});
	}

	applySelectFilter(filterValue: string){
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.data.filter = filterValue;
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
