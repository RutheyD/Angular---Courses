import { CanActivateFn } from '@angular/router';

export const teacherGuard: CanActivateFn = (route, state) => {

  return localStorage.getItem('role')=='teacher' || localStorage.getItem('role')=='admin'


};
