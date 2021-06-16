import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
    selector: 'app-add-user',
    templateUrl: './add.component.html',
})
export class AddUserComponent implements OnInit{
    
    userFormInfo: FormGroup; // typescript variable declaration

    constructor(protected router: Router){}

    ngOnInit(){
    }

    onSubmit(form: FormGroup){

    }
}