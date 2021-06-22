import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { Contact } from '../../interfaces/contact';
import { ContactsService } from '../../services/contacts/contacts.service';

import { SaleOrder } from '../../interfaces/sale-order';
import { SalesOrderService } from '../../services/sales_order/sales-order.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	// Pie chard for contact
	contactPieChartLabels : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];;
	contactPieChartData : number[] = [40, 20, 15 , 10, 10, 5];
	contactPieChartType : string = 'pie';
	
	// Pie chard for sale order
	saleOrderPieChartLabels : string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
	saleOrderPieChartData : number[] = [40, 20, 30, 10];
	saleOrderPieChartType : string = 'pie';

	contactDataSrc : Contact[] = [];
	contactDisplayedCols : string[] = ['contactName', 'assignedTo', 'updatedTime'];
	contactLength : number;

	saleOrderDataSrc : SaleOrder[] = [];
	saleOrderDisplayedCols : string[] = ['subject', 'total', 'updatedTime'];
	saleOrderLength : number;

	@ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
	@ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('input', {static: false}) input: ElementRef;

	constructor(private contactsService : ContactsService,
				private salesOrderService : SalesOrderService) { 
		
		// get list of contacts
		this.contactsService
			.getContacts()
			.subscribe((data) => {
				this.contactLength = data.length;
				this.contactDataSrc = data.map((value, index) => {
					value.updatedTime = new Date(value.updatedTime).toLocaleString();
					return value;
				});
			});
		
		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
				this.saleOrderLength = data.length;
				this.saleOrderDataSrc = data.map((value, index) => {
					value.updatedTime = new Date(value.updatedTime).toLocaleString();
					return value;
				});
			});
	}

	ngOnInit() {
	}

	// events
	chartClicked(e : any) : void {
		// console.log(e);
	}
	 
	chartHovered(e : any) : void {
		// console.log(e);
	}

}
