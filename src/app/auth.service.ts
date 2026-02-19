import { Injectable } from "@angular/core";

@Injectable
({
    providedIn: 'root'
})

export class AuthService {

     private currentRole: string | null = null;

  login(username: string, password: string): string | null  //here it returns role if login succeeds, otherwise null
   {
   
      //Simulated credential validation

    if (username === 'employee' && password === 'employee789')
       {
          this.currentRole = 'Employee';
    } 
    else if (username === 'manager' && password === 'manager456')
       {
         this.currentRole = 'Manager';
    } 
    else if (username === 'admin' && password === 'admin123')
       {
          this.currentRole = 'Admin';
       } 
    else
       {

         //Credentials do not match any predefined user
        return null;  
       }
   
        localStorage.setItem('role', this.currentRole);
         return this.currentRole;
}

  getRole(): string | null 
  {
    return this.currentRole || localStorage.getItem('role'); //User remains logged in after refresh
  }

  logout()
   {

      //resets in-memory role
    this.currentRole = null;
    localStorage.removeItem('role');
  }

   }
