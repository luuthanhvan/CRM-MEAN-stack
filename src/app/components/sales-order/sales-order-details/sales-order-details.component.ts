import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleOrder } from '../../../interfaces/sale-order';

@Component({
    selector: 'sales-order-details-dialog',
    templateUrl: 'sales-order-details.component.html'
})
export class SalesOrderDetailsDialog {
    salesOrder$ : Observable<SaleOrder>;

    constructor(){}
}