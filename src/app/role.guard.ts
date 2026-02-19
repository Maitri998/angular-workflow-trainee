import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable
({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate // implemented CanActivate to determine whether navigation is allowed
 { 
     constructor(private auth: AuthService, private router: Router) {}

       canActivate(route: ActivatedRouteSnapshot): boolean {

    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.auth.getRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/login']);

    // this will block the route activation
    return false;
  }
}
