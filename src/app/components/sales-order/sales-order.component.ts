import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { SaleOrder } from '../../interfaces/sale-order'; // use sale order interface
import { SalesOrderService } from '../../services/sales_order/sales-order.service'; // use sale order service

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

	filtersForm : FormGroup;

	constructor(private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder){

		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
				console.log(data);
				this.dataSource = data.map((value, index) => {
					value.no = index+1;
					return value;
				});
			});
  	}

	ngOnInit() {
		this.filtersForm = this.formBuilder.group({
			status: new FormControl(this.salesOrderService.statusNames),
            createdTime: new FormControl(''),
            updatedTime: new FormControl(''),
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
}
