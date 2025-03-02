import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,MatCardModule,MatButtonModule,MatFormFieldModule
    ,MatInputModule,MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  private router = inject(Router)
  // user !:UserLogin
  userLoginForm!:FormGroup;
  constructor(private fb:FormBuilder,private userService:AuthService){}
get user():{[key:string]:AbstractControl}{
  return this.userLoginForm.controls;
}
  ngOnInit(): void {
    this.userLoginForm=this.fb.group({
email:['',[Validators.required,Validators.email]],
password:['',[Validators.required,Validators.minLength(5)]]
})
  }
  onSubmit(){
    const user=this.userLoginForm.value;
   this.userService.login(this.userLoginForm.value).subscribe(
    {next:response=>{
      this.userService.saveToken(response.token)
      this.router.navigate(['/homePage']);

    }
    ,error:(e)=>{
console.error(e.error.message)
   }})  
}
}
