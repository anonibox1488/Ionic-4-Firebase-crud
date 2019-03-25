import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: TaskI = {
    task: '',
    priority: 0
  };
  todoId = null;

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private todoService: TodoService,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId) {
      this.loadTodo();
    }
  }

  async loadTodo() {
    const loading = await this.loading.create({
      message: 'Cargando...'
    });

    await loading.present();
    this.todoService.getTodo(this.todoId).subscribe(resp => {
      loading.dismiss();
      this.todo = resp;
    });
  }

  async saveTodo() {
    const loading = await this.loading.create({
      message: 'Guardando...'
    });
    if (this.todoId) {
      this.todoService.updateTodo(this.todo, this.todoId)
        .then(() => {
          loading.dismiss();
          this.nav.navigateForward('/');
        })
        .catch(err => console.log(err));
    } else {
      this.todoService.addTodo(this.todo)
        .then(() => {
          loading.dismiss();
          this.nav.navigateForward('/');
        })
        .catch(err => console.log(err));
    }
  }

  onRemove(IdTodo: string) {
    this.todoService.removeTodo(IdTodo);
  }

}
