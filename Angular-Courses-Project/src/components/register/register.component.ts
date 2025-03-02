import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRegister } from '../../models/userLogin';
import { AuthService } from '../../services/auth.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,MatCardModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
userRegister!:UserRegister;
  userRegisterForm!: FormGroup;
  private router = inject(Router)
  constructor( private fb: FormBuilder,private authService:AuthService) { }
  // constructor(private http: HttpClient, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.userRegisterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', [Validators.required]],
    })
  }
  get user():{[key:string]:AbstractControl}{
    return this.userRegisterForm.controls;
  }
  onSubmit(){
     this.userRegister=this.userRegisterForm.value;
    console.log(this.userRegister);   
    this.authService.register(this.userRegister).subscribe(
    {  next:response=>{
      
          this.router.navigate(['/homePage']);
        // alert('✅' + response.message)
          },error:(e)=>{
            alert('❌ ERROR: ' + (e.error.message || 'משהו השתבש'))  }
        });        

  }
}
