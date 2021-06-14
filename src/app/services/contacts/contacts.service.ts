import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
	salutations : String[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : String[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];

	constructor(private router: Router,
				private formBuilder: FormBuilder) { }

	public getAllContactsInfo(res){
		let contactsInfo : Contact[] = [];

		if(res.length > 0){
			for(let i = 0; i < res.length; i++){
				let createdTime = new Date(res[i].createdTime).toLocaleString();
				let updatedTime = new Date(res[i].updatedTime).toLocaleString();

				let obj = {
					no: i + 1,
					contactID: res[i]._id,
					contactName: res[i].contactName,
					salutation: res[i].salutation,
					mobilePhone: res[i].mobilePhone,
					email: res[i].email,
					organization: res[i].organization,
					dob: res[i].dob,
					leadSrc: res[i].leadSrc,
					assignedTo: res[i].assignedTo,
					creator: res[i].creator,
					address: res[i].address,
					description: res[i].description,
					createdTime: createdTime,
					updatedTime: updatedTime,
				};

				contactsInfo.push(obj);
			}
		}

		return contactsInfo;
	}

	public prepareDataToSubmit(formData, time = undefined){
		let date = new Date(formData.value.dob).toLocaleString();
        let dob = date.substring(0, date.indexOf(','));
		let createdTime = new Date(Date.now()).toLocaleString();
		let updatedTime = new Date(Date.now()).toLocaleString();
		
		if(time != undefined){
			createdTime = new Date(time).toLocaleString();
		}

		const data : any = {
            contactName: formData.value.contactName,
            salutation: formData.value.salutation,
            mobilePhone: formData.value.mobilePhone,
            email: formData.value.email,
            organization: formData.value.organization,
            dob: dob,
            leadSrc: formData.value.leadSrc,
            assignedTo: formData.value.assignedTo,
            address: formData.value.address,
            description: formData.value.description,
            createdTime: createdTime,
            updatedTime: updatedTime,
        }

		return data;
	}

	public prepareFormData(){
		return this.formBuilder.group({
			contactName: new FormControl(''),
            salutation: new FormControl(this.salutations),
            mobilePhone: new FormControl(''),
            email: new FormControl(''),
            organization: new FormControl(''),
            dob: new FormControl(''),
            leadSrc: new FormControl(this.leadSources),
            assignedTo: new FormControl(this.assignedToUsers),
            address: new FormControl(''),
            description: new FormControl(''),
		});
	}

	public setContactInfo(form, data){
		form.setValue({
			contactName: data.contactName,
			salutation: data.salutation,
			mobilePhone: data.mobilePhone,
			email: data.email,
			organization: data.organization,
			dob: data.dob,
			leadSrc: data.leadSrc,
			assignedTo: data.assignedTo,
			address: data.address,
			description: data.description,
		});
	}

	public filterByLeadSrc(data, value){
		return data.filter((val, index, arr) => val.leadSrc == value);
	}

	public gotoPage(namePage){
		this.router.navigate([namePage]);
	}
}
