import { Injectable } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleOrder } from '../../interfaces/sale-order';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
	contactNames : String[] =  ['A', 'B', 'C', 'D', 'E', 'F'];
    statusNames: any[] = ['Created', 'Approved', 'Delivered', 'Cancele'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];

	constructor(private formBuilder : FormBuilder,
				private router: Router) { }

	public getAllSaleOrderInfo(res){
		let salesOrderInfo : SaleOrder[] = [];

		if(res.length > 0){
			for(let i = 0; i < res.length; i++){
				let createdTime = new Date(res[i].createdTime).toLocaleString();
				let updatedTime = new Date(res[i].updatedTime).toLocaleString();
	
				let obj = {
					no: i+1,
					saleOrderID: res[i]._id,
					subject: res[i].subject,
					contactName: res[i].contactName,
					status: res[i].status,
					total: res[i].total,
					assignedTo: res[i].assignedTo,
					description: res[i].description,
					createdTime: createdTime,
					updatedTime: updatedTime,
				};

				salesOrderInfo.push(obj);
			}
		}

		return salesOrderInfo;
	}

	public prepareDataToSubmit(formData, time = undefined){
		let createdTime = new Date(Date.now()).toLocaleString();
		let updatedTime = new Date(Date.now()).toLocaleString();

		if(time != undefined){
			createdTime = new Date(time).toLocaleString();
		}
		
		const data : any = {
            contactName: formData.value.contactName,
            subject: formData.value.subject,
            status: formData.value.status,
            total: formData.value.total,
            assignedTo: formData.value.assignedTo,
            description: formData.value.description,
			createdTime: createdTime,
            updatedTime: updatedTime,
        }

		return data;
	}

	public prepareFormData(){
		return this.formBuilder.group({
			contactName: new FormControl(this.contactNames),
            subject: new FormControl(),
            status: new FormControl(this.statusNames),
            total: new FormControl(''),
            assignedTo: new FormControl(this.assignedToUsers),
            description: new FormControl(''),
		});
	}

	public setSaleOrderInfo(form, data){
		form.setValue({
			contactName: data.contactName,
			subject: data.subject,
			status: data.status,
			total: data.total,
			assignedTo: data.assignedTo,
			description: data.description,
		});
	}

	public filterByStatus(data, value){
		return data.filter((val, index, arr) => val.status == value);
	}

	public gotoPage(namePage){
		this.router.navigate([namePage]);
	}
}
