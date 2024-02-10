import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { map, takeUntil, shareReplay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SaleOrder } from "../../interfaces/sale-order"; // import sale order interface
import * as environment  from "../../../assets/environment.json";

@Injectable({
  providedIn: "root",
})
export class SalesOrderService {
  SERVER_URL: string = environment.baseUrl + "/sales_order";
  private stop$: Subject<void> = new Subject<void>();
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: "True" }) };

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  initSaleOrder() {
    return this.formBuilder.group({
      contactName: new FormControl([], [Validators.required]),
      subject: new FormControl("", [Validators.required]),
      status: new FormControl([], [Validators.required]),
      total: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]+$"),
      ]),
      assignedTo: new FormControl([], [Validators.required]),
      description: new FormControl(""),
    });
  }

  // add a sale order
  addSaleOrder(saleOrder: SaleOrder): Observable<void> {
    return this.httpClient
      .post<void>(this.SERVER_URL, saleOrder)
      .pipe(takeUntil(this.stop$));
  }

  // get list of sales order
  getSalesOrder(): Observable<SaleOrder[]> {
    return this.httpClient
      .post<SaleOrder[]>(`${this.SERVER_URL}/list`, this.noAuthHeader)
      .pipe(
        map((res) => res["data"]["salesOrder"]),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  // get a sale order by sale order ID
  getSaleOrder(saleOrderId: string): Observable<SaleOrder> {
    return this.httpClient
      .get<SaleOrder>(`${this.SERVER_URL}/${saleOrderId}`)
      .pipe(
        map((res) => res["data"]["saleOrder"]),
        takeUntil(this.stop$)
      );
  }

  // update a sale order by sale order ID
  updateSaleOrder(saleOrderId: string, saleOrder: SaleOrder): Observable<void> {
    return this.httpClient
      .put<void>(`${this.SERVER_URL}/${saleOrderId}?_method=PUT`, saleOrder)
      .pipe(takeUntil(this.stop$));
  }

  // delete a sale order by sale order ID
  deleteSaleOrder(saleOrderId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.SERVER_URL}/${saleOrderId}?_method=DELETE`)
      .pipe(takeUntil(this.stop$));
  }

  // delete a sale order by list of sales order ids
  deleteSalesOrder(salesOrderIds: string[]): Observable<void> {
    return this.httpClient
      .post<void>(`${this.SERVER_URL}/delete`, salesOrderIds)
      .pipe(takeUntil(this.stop$));
  }

  searchSaleOrder(subject: string): Observable<SaleOrder[]> {
    return this.httpClient.get<SaleOrder[]>(
      `${this.SERVER_URL}/search/${subject}`
    );
  }

  // stop subcriptions
  stop() {
    this.stop$.next();
    this.stop$.complete();
  }
}
