import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

export interface ContactsInfo {
  no: number,
  contactID: string,
  contactName: string,
  salutation: string,
  mobilePhone: string,
  email: string,
  organization: string,
  dob: string,
  leadSrc: string,
  assignedTo: string,
  creator: string,
  address: string,
  description: string,
  createdTime: string,
  updatedTime: string,
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnChanges{
  
  SERVER_URL : string = 'http://localhost:4040/contacts';

  displayedColumns: string[] = ['no', 'contactID', 'contactName', 'salutation', 'mobilePhone', 'email', 
                                'organization', 'dob', 'leadSrc', 'assignedTo', 'creator', 'address', 
                                'description', 'createdTime', 'updatedTime', 'modify', 'delete'];
  dataSource : ContactsInfo[];

  leadSources : String[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
  leadSrc: FormControl;

  constructor(private httpClient : HttpClient, private router: Router) { 
    
  }

  ngOnInit() {
    this.leadSrc = new FormControl(this.leadSources);
    this.getData();
  }

  ngOnChanges(){
    location.reload(); 
  }

  getData(){
    this.httpClient.get(this.SERVER_URL).subscribe(
      (res) => {
        let CONTACT_DATA : ContactsInfo[] = [];

        for(let i = 0; i < res['data']['contacts'][i].length; i++){
          let createdTime = new Date(res['data']['contacts'][i].createdTime).toLocaleString();
          let updatedTime = new Date(res['data']['contacts'][i].updatedTime).toLocaleString();

          let obj = {
            no: i+1,
            contactID: res['data']['contacts'][i]._id,
            contactName: res['data']['contacts'][i].contactName,
            salutation: res['data']['contacts'][i].salutation,
            mobilePhone: res['data']['contacts'][i].mobilePhone,
            email: res['data']['contacts'][i].email,
            organization: res['data']['contacts'][i].organization,
            dob: res['data']['contacts'][i].dob,
            leadSrc: res['data']['contacts'][i].leadSrc,
            assignedTo: res['data']['contacts'][i].assignedTo,
            creator: res['data']['contacts'][i].creator,
            address: res['data']['contacts'][i].address,
            description: res['data']['contacts'][i].description,
            createdTime: createdTime,
            updatedTime: updatedTime,
          };

          CONTACT_DATA.push(obj);
        }

        this.dataSource = CONTACT_DATA;
      }
    );
  }

  navigateToEdit(contactID: string){
    let navigationExtras : NavigationExtras = {
      queryParams: { id: contactID }
    };
    this.router.navigate(['/contacts/edit'], navigationExtras);
  }

  onDelete(contactID: string){
    this.httpClient.post(this.SERVER_URL + '/delete', {id: contactID}).subscribe();
    location.reload();
  }
}
