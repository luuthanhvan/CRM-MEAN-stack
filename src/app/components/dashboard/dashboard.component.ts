import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { Contact } from '../../interfaces/contact';
import { ContactsService } from '../../services/contacts/contacts.service';

import { SaleOrder } from '../../interfaces/sale-order';
import { SalesOrderService } from '../../services/sales_order/sales-order.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	// Pie chart for contact
	contactPieChartLabels : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];;
	contactPieChartData : number[] = [0, 0, 0, 0, 0, 0];
	contactPieChartType : string = 'pie';
	
	// Pie chart for sale order
	saleOrderPieChartLabels : string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
	saleOrderPieChartData : number[] = [0, 0, 0, 0];
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
	}

	ngOnInit() {
		// get list of contacts
		this.contactsService
			.getContacts()
			.subscribe((data) => {
				// count number of contacts based on the lead source and push it to the contactPieChartData
				this.contactPieChartData = [];
				for(let i = 0; i < this.contactPieChartLabels.length; i++){
					let label = this.contactPieChartLabels[i];
					let countLabel = 0;
					for(let j = 0; j < data.length; j++){
						if(data[j].leadSrc === label){
							countLabel++;
						}
					}
					this.contactPieChartData.push(countLabel);
				}
				
				// get length of contacts information for length of Paginator
				this.contactLength = data.length;
				
				// data source to display on the contact information table
				this.contactDataSrc = data.map((value) => {
					value.updatedTime = new Date(value.updatedTime).toLocaleString();


					return value;
				});
			});

		// get list of sales order
		this.salesOrderService
			.getSalesOrder()
			.subscribe((data) => {
				// count number of sales order based on the status and push it to the saleOrderPieChartData
				this.saleOrderPieChartData = [];
				for(let i = 0; i < this.saleOrderPieChartLabels.length; i++){
					let label = this.saleOrderPieChartLabels[i];
					let countLabel = 0;
					for(let j = 0; j < data.length; j++){
						if(data[j].status === label){
							countLabel++;
						}
					}
					this.saleOrderPieChartData.push(countLabel);
				}

				// get length of sales order information for length of Paginator
				this.saleOrderLength = data.length;

				// data source to display on the sale order information table
				this.saleOrderDataSrc = data.map((value) => {
					value.updatedTime = new Date(value.updatedTime).toLocaleString();
					return value;
				});
			});
	}

	ngAfterViewInit(){
	}

	// events
	chartClicked(e : any) : void {
	}
	 
	chartHovered(e : any) : void {
	}

}
