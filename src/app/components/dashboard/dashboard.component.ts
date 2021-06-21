import { Component, OnInit } from '@angular/core';

import { Contact } from '../../interfaces/contact';
import { SaleOrder } from '../../interfaces/sale-order';
import { ContactsService } from '../../services/contacts/contacts.service';
import { SalesOrderService } from '../../services/sales_order/sales-order.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  	contactDataSrc : Contact[] = [];
	saleOrderDataSrc : SaleOrder[] = [];

	contactDisplayedCols : string[] = ['contactName', 'assignedTo', 'updatedTime'];
	saleOrderDisplayedCols : string[] = ['subject', 'total', 'updatedTime'];
	
	// Pie chard for contact
	contactPieChartLabels : string[] = this.contactsService.leadSources;
	contactPieChartData : number[] = [40, 20, 15 , 10, 10, 5];
	contactPieChartType : string = 'pie';
	
	// Pie chard for sale order
	saleOrderPieChartLabels : string[] = this.salesOrderService.statusNames;
	saleOrderPieChartData : number[] = [40, 20, 30, 10];
	saleOrderPieChartType : string = 'pie';
	
	constructor(private contactsService : ContactsService,
				private salesOrderService : SalesOrderService) { 
		
		// get list of contacts
		this.contactsService
			.getContacts()
			.subscribe((data) => {
				this.contactDataSrc = data.map((value, index) => {
					value.updatedTime = new Date(value.updatedTime).toLocaleString();
					return value;
				});
			});
		
		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
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
		console.log(e);
	}
	 
	chartHovered(e : any) : void {
		console.log(e);
	}

}
