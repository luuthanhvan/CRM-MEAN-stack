import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { UserManagementService } from '../../../services/user_management/user-management.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add.component.html',
})
export class AddUserComponent implements OnInit{
    
    userFormInfo: FormGroup; // typescript variable declaration
    submitted = false;

    constructor(protected router: Router,
                private userService : UserManagementService){}

    ngOnInit(){
        this.userFormInfo = this.userService.initUser();
    }

    get contactFormControl(){
        return this.userFormInfo.controls;
    }

    onSubmit(form: FormGroup){
        this.submitted = true;
        let userInfo = form.value;
        userInfo.createdTime = new Date(Date.now()).toLocaleString();
        
        // console.log(userInfo);
        this.userService
            .addUser(userInfo)
            .subscribe((res) => {
                if(res['status'] == 1) // status = 1 => OK
                    this.router.navigate(['/user_management']);
            });
    }
}