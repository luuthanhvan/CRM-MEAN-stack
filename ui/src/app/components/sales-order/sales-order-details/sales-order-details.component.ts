import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { SaleOrder } from "../../../interfaces/sale-order";
import { DatetimeService } from "../../../services/datetime/datetime.service";

@Component({
  selector: "sales-order-details-dialog",
  templateUrl: "sales-order-details.component.html",
})
export class SalesOrderDetailsDialog {
  salesOrder$: Observable<SaleOrder>;

  constructor(protected datetimeService: DatetimeService) {}
}
