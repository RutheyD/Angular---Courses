import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Course, Lesson } from '../../models/course';
import { CoursesService } from '../../services/courses.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-courses',
  imports: [AsyncPipe, ReactiveFormsModule, MatListModule, MatButtonModule, MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule, MatExpansionModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  role: string = ''
  courseForm!: FormGroup
  lessonForm!: FormGroup
  lessonUpdate!: Lesson;
  lessonAdd!: Lesson;
  idCurrentLesson: number = -1;
  isUpdate: boolean = false
  isAddCourse: boolean = false
  idCurrentCourse: number = -1
  courseUpdate!: Course;
  courseToAdd!: Course
  isUpdateLesson: Boolean = false
  isAddLesson: Boolean = false
  courseIsLessonUpdate: number = -1
  allCourses$: Observable<Course[]>;

  setIsUpdate(course: Course) {
    this.isUpdate = !this.isUpdate
    this.idCurrentCourse = course.id
    this.courseForm.setValue({
      title: course.title,
      description: course.description,
    });
  }
  setIsUpdateLesson(lesson: Lesson) {
    this.isUpdateLesson = !this.isUpdateLesson;
    this.idCurrentLesson = lesson.id;
    this.courseIsLessonUpdate = lesson.courseId
    this.lessonForm.setValue({
      title: lesson.title,
      content: lesson.content,
    })
  }
  setIsAddLesson(courseId: number) {
    this.isAddLesson = !this.isAddLesson
    this.idCurrentCourse = courseId;
  }

  constructor(private coursesService: CoursesService, private fb: FormBuilder) {
    this.allCourses$ = this.coursesService.allCourses$

  }
  ngOnInit(): void {
    this.coursesService.getCourses()

    this.role = this.coursesService.getRoleByToken()
    this.coursesService.getUserIdByToken()

    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(15)]],
    })
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      content: ['', [Validators.required, Validators.minLength(15)]],
    })
  }

  get course(): { [key: string]: AbstractControl } {
    return this.courseForm.controls;
  }
  get lesson(): { [key: string]: AbstractControl } {
    return this.lessonForm.controls;
  }
  deleteCourse(courseId: number) {
    this.coursesService.deleteCourse(courseId)
  }
  onSubmitLesonUpdate() {
    this.isUpdateLesson = !this.isUpdateLesson
    this.lessonUpdate = this.lessonForm.value
    this.lessonUpdate.id = this.idCurrentLesson
    this.lessonUpdate.courseId = this.courseIsLessonUpdate
    this.coursesService.updateLesson(this.lessonUpdate)
  }
  onSubmitUpdateCourse() {
    this.updateCourse()
    this.isUpdate = !this.isUpdate

  }
  updateCourse(){
    this.courseUpdate = this.courseForm.value;
    this.courseUpdate.teacherId = this.coursesService.getUserIdByToken();
    this.courseUpdate.id = this.idCurrentCourse;
    this.coursesService.updateCourse(this.courseUpdate)
  }
  onSubmitAddLesson() {
    this.isAddLesson = !this.isAddLesson
    this.lessonAdd = this.lessonForm.value
    this.lessonAdd.courseId = this.idCurrentCourse
    this.coursesService.addLesson(this.lessonAdd)
  }

  deleteLesson(courseId: number, lessonId: number) {
    this.coursesService.deleteLesson(courseId, lessonId)
  }
  setIsAddCourse() {
    this.isAddCourse = !this.isAddCourse
  }
  onSubmitAddCourse() {
    this.setIsAddCourse()
    this.courseToAdd = this.courseForm.value;
    this.courseToAdd.teacherId = this.coursesService.getUserIdByToken();
    this.coursesService.addCourse(this.courseToAdd)

  }
  onSubmitCourseUpdate() {
    this.updateCourse()
    this.isUpdate = !this.isUpdate
  }
}