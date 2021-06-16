import { Component, OnInit } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { SaleOrder } from '../../interfaces/sale-order';
import { ContactsService } from '../../services/contacts/contacts.service';
import { SalesOrderService } from '../../services/sales_order/sales-order.service';

@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
	contactDataSrc : Contact[] = [];
	saleOrderDataSrc : SaleOrder[] = [];

	contactDisplayedCols: string[] = ['contactName', 'assignedTo', 'createdTime'];
	saleOrderDisplayedCols: string[] = ['subject', 'total', 'createdTime'];

	constructor(private contactsService : ContactsService,
				private salesOrderService : SalesOrderService) {
		// get list of contacts
		this.contactsService
			.getContacts()
			.subscribe((data) => {
				this.contactDataSrc = data.map((value, index) => {
					// if(index < 7)
						return value;
				});
			});
		
		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
				this.saleOrderDataSrc = data.map((value, index) => {
					// while(index < 7)
						return value;
				});
			});
	}

	ngOnInit() {

	}

}
