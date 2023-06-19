import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/login.service';
import { UserModel } from '../models/userModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  rawh8xe: string = ' '

  loginForm: FormGroup;

  constructor(public loginService: LoginService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })
  }

  ngOnInit(): void {
  }

  login() {
    let user: UserModel = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    }
    this.loginService.login(user).subscribe((res: any) => {
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        this.loginService.isAuthenticate = true;
        this.router.navigateByUrl("/generatebacklogs");
      }
    }, (err) => {
      window.alert("Something went wrong please try again");
    });
  }

}
