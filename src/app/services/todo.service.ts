import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskI } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoColletion: AngularFirestoreCollection<TaskI>;
  private todos: Observable<TaskI[]>;

  constructor(db: AngularFirestore) {
    this.todoColletion = db.collection<TaskI>('todos');
    this.todos = this.todoColletion.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
  }

  getTodos() {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todoColletion.doc<TaskI>(id).valueChanges();
  }

  updateTodo(todo: TaskI, id: string) {
    return this.todoColletion.doc(id).update(todo);
  }

  addTodo(todo: TaskI) {
    return this.todoColletion.add(todo);
  }

  removeTodo(id: string) {
    return this.todoColletion.doc(id).delete();
  }







}
