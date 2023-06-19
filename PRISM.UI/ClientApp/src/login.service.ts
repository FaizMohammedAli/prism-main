import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { UserModel } from './app/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isAuthenticate: boolean = false;

  baseUrl = "https://api-prism.azurewebsites.net/UserLogin/";

  constructor(private http: HttpClient) { }

  login(userModel: UserModel) {
    return this.http.post(this.baseUrl + 'login', userModel);
  }

}