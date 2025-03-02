import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin, UserRegister } from '../models/userLogin';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(user: UserRegister): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/register', user);
  }
  login(user: UserLogin): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/login', user);
  }
  saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }
  getToken() {
    return sessionStorage.getItem('token');
  }
logout(){
  sessionStorage.removeItem('token');
}

getUserNameFromToken(): string {
  const token = this.getToken()
  if (!token) return ''
  try {
    const decodedToken: any = jwtDecode(token)
    console.log(decodedToken)
    return decodedToken.userName
  }
  catch (error) {
    console.error('שגיאה בפענוח ה-Token:', error)
    return ''
  }
}

}


// export class UserService {

//   logout() {
//     localStorage.removeItem('token');
//   }

//   // getUserById(id:string):Observable<any>{
//   //   return this.http.post<any>('http://localhost:3000/api/users/:id',id)
//   // }

//   getUserName(): string {
//     const token = this.getToken();
//     console.log("token " + token);
//     if (!token) return '';
//     try {
//       const decodedToken: any = jwtDecode(token);
//       console.log(decodedToken)
//       return decodedToken.userName!;
//     }
//     catch (error) {
//       console.error('שגיאה בפענוח ה-Token:', error);
//       return '';
//     }
//   }
// }

