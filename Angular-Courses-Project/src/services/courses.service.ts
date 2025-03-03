import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Lesson } from '../models/course';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courseSubject!: BehaviorSubject<Course[]>;
  private myCourseSubject:BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  myCourses$:Observable<Course[]>;
  allCourses$: Observable<Course[]> 
  constructor(private http: HttpClient) { 
    this.courseSubject = new BehaviorSubject<Course[]>([]);
    this.allCourses$ = this.courseSubject.asObservable();
    this.myCourses$=this.myCourseSubject.asObservable();

 }

  getCourses() {
    this.http.get<Course[]>('http://localhost:3000/api/courses').subscribe(
      data => {
        this.courseSubject.next(data);
        data.forEach(course => {
          // שולח קריאה כדי להוריד את השיעורים עבור כל קורס
          this.getLessonsByCourse(course.id);
        });
      }
    );
  }
  
  getLessonsByCourse(courseId: number) {
    this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`).subscribe({
      next: (lessons) => {
        const courses = this.courseSubject.getValue();
        const courseToUpdate = courses.find(course => course.id === courseId);
        if (courseToUpdate) {
          courseToUpdate.lessons = lessons;
          this.courseSubject.next([...courses]);
        }
      }
    });
  }
  addCourse(course: Course) {
    return this.http.post<any>('http://localhost:3000/api/courses', course).subscribe({
      next: (response) => {
        this.getCourses()
      }, error: (e) => {
        alert('error '+ e)
      }
    })
  }
  updateCourse(course: Course) {
    console.log(course+" in updaye course")
    if(course)
    this.http.put(`http://localhost:3000/api/courses/${course.id}`, course).subscribe({
      next: (response) => {
        this.getCourses()
      }, error: (e) => {
        alert('error')
      }
    })
  }
  deleteCourse(courseId: number) {
    this.http.delete(`http://localhost:3000/api/courses/${courseId}`).subscribe({
      next: (response) => {
        this.getCourses()
      }, error: (e) => {
        alert('error')
      }
    })
  }
  deleteLessonsByCourseId(courseId: number) {
    return this.http.delete(`http://localhost:3000/api/courses/${courseId}/lessons`).subscribe({
      next: (response) => {
        this.getCourses()
        this.getLessonsByCourse(courseId)
      }, error: (e) => {
        alert('error')
      }
    })
  }
  deleteLesson(courseId: number, lessonId: number) {
    return this.http.delete(`http://localhost:3000/api/courses/${courseId}/lessons/${lessonId}`).subscribe({
      next: (response) => {
        this.getCourses()
        this.getLessonsByCourse(courseId)
      }, error: (e) => {
        alert('error')
      }
    })
  }
  addLesson(lesson: Lesson) {
    this.http.post<Lesson>(`http://localhost:3000/api/courses/${lesson.courseId}/lessons`, lesson).subscribe({
      next: response => {
        this.getCourses();
        this.getLessonsByCourse(lesson.courseId)
      }
    })
  }

  updateLesson(lesson: Lesson) {
    this.http.put(`http://localhost:3000/api/courses/${lesson.courseId}/lessons/${lesson.id}`, lesson).subscribe({
      next: response => {
        this.getCourses();
        this.getLessonsByCourse(lesson.courseId)
      }
    })
  }

  getRoleByToken(): string {
    const token = sessionStorage.getItem('token');
    if (!token) return ''
    try {
      const decodedToken: any = jwtDecode(token)
      return decodedToken.role
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error)
      return ''
    }
  }
  getUserIdByToken(): number {
    const token = sessionStorage.getItem('token');
    if (!token) return -1
    try {
      const decodedToken: any = jwtDecode(token)

      return decodedToken.userId
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error)
      return -1
    }
  }
  addCourseToUser(courseId:number){
    const userId=this.getUserIdByToken()
    this.http.post(`http://localhost:3000/api/courses/${courseId}/enroll`,{userId}).subscribe({
      next:(response)=>{
        this.getCourses();
      },error:(e)=>{

      }
    })

  }
  deleteCurrentCourseForUser(courseId:number){
    const userId=this.getUserIdByToken()
    this.http.delete(`http://localhost:3000/api/courses/${courseId}/unenroll`,{body:{userId}}).subscribe({
      next:(response)=>{
        this.getCourses();
      },error:(e)=>{
    
      }
    })
  }
  getLessonsToMyCourse(courseId:number){
    this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`).subscribe({
      next: (lessons) => {
        const courses = this.myCourseSubject.getValue();
        const courseToUpdate = courses.find(course => course.id === courseId);
        if (courseToUpdate) {
          courseToUpdate.lessons = lessons;
          this.myCourseSubject.next([...courses]);
        }
      }
    });
  }
  getMyCourses(){
    const studentId=this.getUserIdByToken()
  this.http.get<Course[]>(`http://localhost:3000/api/courses/student/${studentId}`).subscribe({
    next:(data)=>{
      data.forEach(course=>{
        this.getLessonsToMyCourse(course.id)
          })
this.myCourseSubject.next(data)
    },error:(e)=>{
      console.error('Failed to fetch my courses', e);
    }
  })
  }
  //   getCourses(): Observable<any>{
  //     return this.http.get<Course[]>('http://localhost:3000/api/courses')
  //   }
  //   getLessonsByCourse(courseId:number): Observable<any>{
  //     console.log('in lesson service ');
  //    return this.http.get<Lesson[]>(`http://localhost:3000/api/courses/${courseId}/lessons`)
  //   }
  //   addNewCourse(course:Course):Observable<any>{
  //     return this.http.post<any>('http://localhost:3000/api/courses',course)
  //   }
  //   updateCourse(course:Course){
  //     return this.http.put(`http://localhost:3000/api/courses/${course.id}`,course);
  //   }
  //   deleteCourse(courseId:number){
  //     return this.http.delete(`http://localhost:3000/api/courses/${courseId}`);
  //   }
  //   deleteLessonsByCourseId(courseId:number){
  //     return this.http.delete(`http://localhost:3000/api/courses/${courseId}/lessons`);
  //   }
  //   deleteLesson(courseId:number,lessonId:number){
  //     return this.http.delete(`http://localhost:3000/api/courses/${courseId}/lessons/${lessonId}`);
  //   }
  //   addLesson(lesson:Lesson){
  // return this.http.post<Lesson>(`http://localhost:3000/api/courses/${lesson.courseId}/lessons`,lesson);
  //   }
  //   updateLesson(lesson:Lesson){
  //     return this.http.put(`http://localhost:3000/api/courses/${lesson.courseId}/lessons/${lesson.id}`,lesson)
  //   }
  //   getRoleByToken():string{
  //     const token = sessionStorage.getItem('token');
  //       if (!token) return ''
  //       try {
  //         const decodedToken: any = jwtDecode(token)
  //         // console.log(decodedToken)
  //         // console.log(decodedToken.role);
  //         return decodedToken.role
  //       }
  //       catch (error) {
  //         console.error('שגיאה בפענוח ה-Token:', error)
  //         return ''
  //       }
  //   }
  //   getUserIdByToken():number{
  //     const token = sessionStorage.getItem('token');
  //     if (!token) return -1
  //     try {
  //       const decodedToken: any = jwtDecode(token)
  //       // console.log(decodedToken)
  //       // console.log(decodedToken.userId);
  //       return decodedToken.userId
  //     }
  //     catch (error) {
  //       console.error('שגיאה בפענוח ה-Token:', error)
  //       return -1
  //     }
  //   }
}
