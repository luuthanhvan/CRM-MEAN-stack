import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-sales-order',
    templateUrl: './add.component.html',
})
export class AddSaleOrderComponent implements OnInit{
    
    saleOrderFormInfo: FormGroup; // typescript variable declaration
    contactNames : String[] =  ['A', 'B', 'C', 'D', 'E', 'F'];
    statusNames: any[] = ['Created', 'Approved', 'Delivered', 'Cancele'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];
    
    SERVER_URL : String = 'http://localhost:4040/sales_order';

    constructor(private router: Router, private formBuilder: FormBuilder, private httpClient : HttpClient){

    }

    ngOnInit(){
        this.saleOrderFormInfo = this.formBuilder.group({
            contactName: new FormControl(this.contactNames),
            subject: new FormControl(),
            status: new FormControl(this.statusNames),
            total: new FormControl(''),
            assignedTo: new FormControl(this.assignedToUsers),
            description: new FormControl(''),
        });    
    }

    onSubmit(form: FormGroup){
        // console.log(form.value);
        const url : string = this.SERVER_URL + '/store';
        
        const body : any = {
            contactName: form.value.contactName,
            subject: form.value.subject,
            status: form.value.status,
            total: form.value.total,
            assignedTo: form.value.assignedTo,
            description: form.value.description,
        }

        this.httpClient.post<any>(url, body).subscribe();
        this.goBack();
    }

    goBack(){
        this.router.navigate(['/sales_order']);
    }
}