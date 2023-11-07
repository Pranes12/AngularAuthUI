import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import validateform from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  type:string = "password";
  isText:boolean = false;
  eyeIcon:string ="fa-eye-slash";
  loginForm!:FormGroup;
  constructor (
    private fb:FormBuilder,
    private auth : AuthService,
    private router:Router,
    private toast:NgToastService,
    private userStore:UserStoreService,
    ){}

  ngOnInit():void{
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required],

    })
  }

  hideShowPass (){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    console.log('login call', this.loginForm);
    if(this.loginForm.valid){      
      // console.log(this.loginForm.value)
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          // alert(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:3000});
          this.router.navigate(['dashboard']);
        },
        error : (err)=>{
          // alert (err?.error.message);
          this.toast.error({detail:"ERROR",summary:"Something Went Worng",duration:3000});
        }
      })

    }else{

      validateform.validateAllFormFields(this.loginForm)
      alert("Your Form is Invalid")
    }
  }

  

}
