import { CanActivateFn, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { inject } from '@angular/core';

export const teacherGuard: CanActivateFn = (route, state) => {


  const service=inject(CoursesService);
  const status=service.getRoleByToken()
  
   return status==='admin'||status==='teacher'
  
};
