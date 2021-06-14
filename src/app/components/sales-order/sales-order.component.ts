import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';

import { SaleOrder } from '../../interfaces/sale-order';
import { SalesOrderService } from '../../services/sales_order/sales-order.service';

@Component({
  selector: "app-sales-order",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.scss"],
})
export class SalesOrderComponent implements OnInit {
	SERVER_URL: string = "http://localhost:4040/sales_order";
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

	constructor(private httpClient: HttpClient,
				private router: Router,
				protected salesOrderService: SalesOrderService,
				private formBuilder: FormBuilder){
		this.httpClient
			.get(this.SERVER_URL)
			.pipe(map((res) => res["data"]["salesOrder"]))
			.subscribe((res) => {
				this.dataSource = this.salesOrderService.getAllSaleOrderInfo(res);
			});
  	}

	ngOnInit() {
		this.filtersForm = this.formBuilder.group({
			status: new FormControl(this.salesOrderService.statusNames),
            createdTime: new FormControl(''),
            updatedTime: new FormControl(''),
		});
	}

	onSubmitFiltersForm(form: FormGroup){
		this.dataSource = this.salesOrderService.filterByStatus(this.dataSource, form.value.status);
	}

	onCancel(){
        location.reload();
    }

	navigateToEdit(saleOrderID: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: saleOrderID },
		};
		this.router.navigate(["/sales_order/edit"], navigationExtras);
	}

	onDelete(saleOrderID: string) {
		this.httpClient
			.post(`${this.SERVER_URL}/delete`, { id: saleOrderID })
			.subscribe(
				res => {
					if(res['status'] == 1)
						location.reload();
				}
			);
	}
}
