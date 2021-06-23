import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SaleOrder } from '../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../services/sales_order/sales-order.service'; // use sale order service
import { datetimeFormat } from '../../helpers/datetime_format';

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
	statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];

	statusForm : FormGroup;

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder,
				public dialog: MatDialog,){

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
			});
  	}

	ngOnInit() {
		this.statusForm = this.formBuilder.group({
			status: new FormControl(''),
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
    }
}

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
}
