import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router, NavigationExtras } from "@angular/router";
import { Observable } from "rxjs";
import {
  tap,
  switchMap,
  distinctUntilChanged,
  debounceTime,
} from "rxjs/operators";
import { User } from "../../interfaces/user";
import { Contact } from "../../interfaces/contact";
import { SaleOrder } from "../../interfaces/sale-order";
import { ContactsService } from "../../services/contacts/contacts.service";
import { SalesOrderService } from "../../services/sales_order/sales-order.service";
import { AuthService } from "../../services/auth/auth.service";
import { DatetimeService } from "../../services/datetime/datetime.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  // Pie chart for contact
  contactPieChartLabels: string[] = [
    "Existing Customer",
    "Partner",
    "Conference",
    "Website",
    "Word of mouth",
    "Other",
  ];
  contactPieChartData: number[] = [0, 0, 0, 0, 0, 0];
  contactPieChartType: string = "pie";

  // Pie chart for sale order
  saleOrderPieChartLabels: string[] = [
    "Created",
    "Approved",
    "Delivered",
    "Canceled",
  ];
  saleOrderPieChartData: number[] = [0, 0, 0, 0];
  saleOrderPieChartType: string = "pie";

  contactDataSrc: Contact[] = [];
  contactData = new MatTableDataSource();
  contactDisplayedCols: string[] = ["contactName", "assignedTo", "updatedTime"];
  contactLength: number;

  saleOrderDataSrc: SaleOrder[] = [];
  saleOrderData = new MatTableDataSource();
  saleOrderDisplayedCols: string[] = ["subject", "total", "updatedTime"];
  saleOrderLength: number;

  isShowDetail: boolean = false; // use for show/hide a sale order detail
  saleOrderDetail: SaleOrder;
  user$: Observable<User>;

  @ViewChild("contactPaginator", { static: false })
  contactPaginator: MatPaginator;
  @ViewChild("saleOrderPaginator", { static: false })
  saleOrderPaginator: MatPaginator;

  constructor(
    private contactsService: ContactsService,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private authService: AuthService,
    protected datetimeService: DatetimeService
  ) {}

  ngOnInit() {
    // get current user logged information, we use getUser here
    this.user$ = this.authService.getUser();

    this.contactsService
      .getContacts()
      .pipe(
        tap((data) => {
          // count number of contacts based on the lead source and push it to the contactPieChartData
          this.contactPieChartData = [];
          for (let i = 0; i < this.contactPieChartLabels.length; i++) {
            let label = this.contactPieChartLabels[i];
            let countLabel = 0;
            for (let j = 0; j < data.length; j++) {
              if (data[j].leadSrc === label) {
                countLabel++;
              }
            }
            this.contactPieChartData.push(countLabel);
          }

          // get length of contacts information for length of Paginator
          this.contactLength = data.length;

          // data source to display on the contact information table
          this.contactDataSrc = data.map((value) => value);
          this.contactData = new MatTableDataSource(this.contactDataSrc);
          this.contactData.paginator = this.contactPaginator;
        })
      )
      .subscribe();

    // get list of sales order
    this.salesOrderService
      .getSalesOrder()
      .pipe(
        tap((data) => {
          // count number of sales order based on the status and push it to the saleOrderPieChartData
          this.saleOrderPieChartData = [];
          for (let i = 0; i < this.saleOrderPieChartLabels.length; i++) {
            let label = this.saleOrderPieChartLabels[i];
            let countLabel = 0;
            for (let j = 0; j < data.length; j++) {
              if (data[j].status === label) {
                countLabel++;
              }
            }
            this.saleOrderPieChartData.push(countLabel);
          }

          // get length of sales order information for length of Paginator
          this.saleOrderLength = data.length;

          // data source to display on the sale order information table
          this.saleOrderDataSrc = data.map((value) => value);
          this.saleOrderData = new MatTableDataSource(this.saleOrderDataSrc);
          this.saleOrderData.paginator = this.saleOrderPaginator;
        })
      )
      .subscribe();
  }

  // function to handle chart clicked event
  chartClicked(e: any, chartName: string): void {
    // get value (lead source or status) from the chart
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];

        // get value by index
        // const value = chart.data.datasets[0].data[clickedElementIndex];
        // console.log(clickedElementIndex, label, value)

        // navigation
        if (chartName === "contacts") {
          // pass the lead source label to the Contacts page
          let navigationExtras: NavigationExtras = {
            queryParams: { leadSrc: label },
          };
          this.router.navigate(["/contacts"], navigationExtras);
        }

        if (chartName === "salesOrder") {
          // pass the status label to the Contacts page
          let navigationExtras: NavigationExtras = {
            queryParams: { status: label },
          };
          this.router.navigate(["/sales_order"], navigationExtras);
        }
      }
    }
  }

  chartHovered(e: any, chartName: string): void {}

  // function to handle clicked on Assigned column
  onClickedCell(assignedTo: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { assignedTo: assignedTo },
    };
    this.router.navigate(["/contacts"], navigationExtras);
  }

  // function to show a sale order detail when clicked on a row of the sale order table
  onShowDetail(saleOrder: SaleOrder) {
    this.isShowDetail = true;
    this.saleOrderDetail = saleOrder;
  }

  onHideDetail() {
    this.isShowDetail = false;
  }
}
