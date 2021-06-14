import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

export interface SalesOrderInfo {
  no: number,
  saleOrderID: string,
  subject: string,
  contactName: string,
  status: string,
  total: string,
  assignedTo: string,
  description: string,
  createdTime: string,
  updatedTime: string,
}

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit, OnChanges {

  SERVER_URL : string = 'http://localhost:4040/sales_order';

  displayedColumns: string[] = ['no', 'saleOrderID', 'subject', 'contactName', 'status', 'total', 
                                'assignedTo', 'description', 'createdTime', 'updatedTime', 'modify', 'delete'];
  dataSource : SalesOrderInfo[];

  statusName : string[] = ['Created', 'Approved', 'Delivered', 'Cancelled'];
  status: FormControl;
  
  constructor(private httpClient : HttpClient, private router: Router) { }

  ngOnInit() {
    this.status = new FormControl(this.statusName);
  }

  ngOnChanges(){
    location.reload();
  }

  getData(){
    this.httpClient.get(this.SERVER_URL).subscribe(
      (res) => {
        let SALES_ORDER_DATA : SalesOrderInfo[] = [];

        for(let i = 0; i < res['data']['salesOrder'][i].length; i++){
          let createdTime = new Date(res['data']['salesOrder'][i].createdTime).toLocaleString();
          let updatedTime = new Date(res['data']['salesOrder'][i].updatedTime).toLocaleString();

          let obj = {
            no: i+1,
            saleOrderID: res['data']['salesOrder'][i]._id,
            subject: res['data']['salesOrder'][i].subject,
            contactName: res['data']['salesOrder'][i].contactName,
            status: res['data']['salesOrder'][i].status,
            total: res['data']['salesOrder'][i].total,
            assignedTo: res['data']['salesOrder'][i].assignedTo,
            description: res['data']['salesOrder'][i].description,
            createdTime: createdTime,
            updatedTime: updatedTime,
          };

          SALES_ORDER_DATA.push(obj);
        }

        this.dataSource = SALES_ORDER_DATA;
      }
    );
  }

  navigateToEdit(saleOrderID: string){
    let navigationExtras : NavigationExtras = {
      queryParams: { id: saleOrderID }
    };
    this.router.navigate(['/sales_order/edit'], navigationExtras);
  }

  onDelete(saleOrderID: string){
    this.httpClient.post(this.SERVER_URL + '/delete', {id: saleOrderID}).subscribe();
    location.reload();
  }

}
