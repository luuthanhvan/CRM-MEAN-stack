import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-sales-order',
    templateUrl: './edit.component.html',
})
export class EditSalesOrderComponent implements OnInit {
    saleOrderFormInfo: FormGroup; // typescript variable declaration
    contactNames : String[] =  ['A', 'B', 'C', 'D', 'E', 'F'];
    statusNames: any[] = ['Created', 'Approved', 'Delivered', 'Cancele'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];
    
    saleOrderId: string;
    createdTime: any;

    SERVER_URL : String = 'http://localhost:4040/sales_order';

    constructor(private router: Router, private formBuilder: FormBuilder,
        private httpClient : HttpClient, private route: ActivatedRoute){
        
        this.route.queryParams.subscribe((params) => {
            this.saleOrderId = params['id'];
        });

        this.saleOrderFormInfo = this.formBuilder.group({
            contactName: new FormControl(this.contactNames),
            subject: new FormControl(),
            status: new FormControl(this.statusNames),
            total: new FormControl(''),
            assignedTo: new FormControl(this.assignedToUsers),
            description: new FormControl(''),
        });   
    }

    ngOnInit(){
        this.httpClient.post(this.SERVER_URL+'/edit', { id: this.saleOrderId }).subscribe(
            (res) => {
                this.saleOrderFormInfo.setValue({
                    contactName: res['data']['saleOrder'].contactName,
                    subject: res['data']['saleOrder'].subject,
                    status: res['data']['saleOrder'].status,
                    total: res['data']['saleOrder'].total,
                    assignedTo: res['data']['saleOrder'].assignedTo,
                    description: res['data']['saleOrder'].description,
                });
                this.createdTime = res['data']['saleOrder'].createdTime; // keep created time
            }
        );
    }

    onSubmit(form: FormGroup){
        const url : string = this.SERVER_URL + '/update';
        let date = new Date(form.value.dob).toLocaleString();
        let dob = date.substring(0, date.indexOf(','));

        const body : any = {
            saleOrderId: this.saleOrderId,
            saleOrderInfo: {
                contactName: form.value.contactName,
                subject: form.value.subject,
                status: form.value.status,
                total: form.value.total,
                assignedTo: form.value.assignedTo,
                description: form.value.description,
                createdTime: this.createdTime,
                updatedTime: Date.now(),
            },
        }

        this.httpClient.post<any>(url, body).subscribe();
        this.goBack();
    }

    goBack(){
        this.router.navigate(['/sales_order']);
    }
}