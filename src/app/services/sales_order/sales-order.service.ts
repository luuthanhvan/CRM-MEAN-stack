import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SaleOrder } from '../../interfaces/sale-order'; // import sale order interface

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
	SERVER_URL: string = "http://localhost:4040/sales_order";
	
	constructor(private formBuilder : FormBuilder,
				private httpClient : HttpClient) { }
	
	initSaleOrder(){
		return this.formBuilder.group({
			contactName: new FormControl([], [Validators.required]),
            subject: new FormControl('', [Validators.required]),
            status: new FormControl([], [Validators.required]),
            total: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$")]),
            assignedTo: new FormControl([], [Validators.required]),
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

	// delete a sale order by list of sales order ids
	deleteSalesOrder(salesOrderIds : string[]):Observable<void>{
		return this.httpClient
					.post<void>(`${this.SERVER_URL}/delete`, salesOrderIds);
	}
}
