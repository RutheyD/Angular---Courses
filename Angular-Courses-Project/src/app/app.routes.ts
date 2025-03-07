import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { AuthComponent } from '../components/auth/auth.component';
import { authGuard } from '../guards/auth.guard';
import { CoursesComponent } from '../components/courses/courses.component';
import { teacherGuard } from '../guards/teacher.guard';
import { CoursesListComponent } from '../components/courses-list/courses-list.component';
import { MyCoursesComponent } from '../components/my-courses/my-courses.component';

export const routes: Routes = [

    { path: '', redirectTo: 'homePage', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
   {path:'homePage',component:HomePageComponent,canActivate:[authGuard]},
    {path:'login',component:LoginComponent},
   {path:'register',component:RegisterComponent},
    {path:'teacher',component:CoursesComponent,canActivate:[authGuard,teacherGuard]},
    {path:'courses',component:CoursesListComponent,canActivate:[authGuard]},
    {path:'myCourses',component:MyCoursesComponent,canActivate:[authGuard]},

    
];
