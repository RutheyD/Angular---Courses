import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Course } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-list',
  imports: [AsyncPipe,MatExpansionModule,MatListModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent {

  constructor(private coursesService: CoursesService,private router:Router) { 
    this.allCourses$=this.coursesService.allCourses$
    this.coursesService.getCourses()
  }
  allCourses$:Observable<Course[]> | undefined;
  addCourseToUser(courseId:number){
    this.coursesService.addCourseToUser(courseId)

  }
  deleteCurrentCourse(courseId:number){
    this.coursesService.deleteCurrentCourseForUser(courseId)

  }


}