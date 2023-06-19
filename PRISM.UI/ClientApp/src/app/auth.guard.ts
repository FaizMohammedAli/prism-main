import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router
} from "@angular/router";
import { LoginService } from "src/login.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: LoginService,
        private router: Router) { }
    canActivate() {
        let isAuthenticated = !!localStorage.getItem('token');
        console.log(isAuthenticated, "from auth guard");
        if (!isAuthenticated) {
            this.router.navigateByUrl("/login");
        }
        return isAuthenticated;
    }
}
