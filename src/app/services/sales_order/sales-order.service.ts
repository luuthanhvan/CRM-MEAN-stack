import { Injectable } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SaleOrder } from '../../interfaces/sale-order'; // import sale order interface

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
	contactNames : String[] =  ['A', 'B', 'C', 'D', 'E', 'F'];
    statusNames: any[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];
	SERVER_URL: string = "http://localhost:4040/sales_order";
	
	constructor(private formBuilder : FormBuilder,
				private httpClient : HttpClient) { }
	
	initSaleOrder(){
		return this.formBuilder.group({
			contactName: new FormControl(this.contactNames),
            subject: new FormControl(),
            status: new FormControl(this.statusNames),
            total: new FormControl(''),
            assignedTo: new FormControl(this.assignedToUsers),
            description: new FormControl(''),
		});
	}

	// add a sale order
	addSaleOrder(saleOrder: SaleOrder):Observable<void>{
		return this.httpClient
					.post<void>(this.SERVER_URL, saleOrder);
	}
  
	// get list of sales order
	getSalesOrder():Observable<SaleOrder[]>{
		return this.httpClient
					.get<SaleOrder[]>(this.SERVER_URL)
					.pipe(map(res => res['data']['salesOrder']));
	}

	// get a sale order by sale order ID
	getSaleOrder(saleOrderId: string):Observable<SaleOrder>{
		return this.httpClient
					.get<SaleOrder>(`${this.SERVER_URL}/${saleOrderId}`)
					.pipe(map(res => res['data']['saleOrder']));
	}

	// update a sale order by sale order ID
	updateSaleOrder(saleOrderId: string, saleOrder: SaleOrder):Observable<void>{
		return this.httpClient
					.put<void>(`${this.SERVER_URL}/${saleOrderId}?_method=PUT`, saleOrder);
	}

	// delete a sale order by sale order ID
	deleteSaleOrder(saleOrderId : string):Observable<void>{
		return this.httpClient
					.delete<void>(`${this.SERVER_URL}/${saleOrderId}?_method=DELETE`);
	}
}
