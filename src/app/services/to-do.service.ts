import { Injectable } from '@angular/core';
import ToDoItemCreateDto from '../domain/dtos/to-do-item-create.dto';
import ToDoItemUpdateDto from '../domain/dtos/to-do-item-update.dto';
import ToDoItemModel from '../domain/models/to-do-item.model';
import { HttpClient } from '@angular/common/http';
import ServiceBase from './service-base';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToDoService extends ServiceBase {
  private items: ToDoItemModel[];
  private urlBase: string;

  constructor(private http: HttpClient) {
    super();
    this.items = [];
    this.urlBase = 'https://localhost:7225/todos';
  }

  list() {
    return this.http.get<ToDoItemModel[]>(this.urlBase).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: ToDoItemCreateDto) {
    return this.http.post(this.urlBase, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(dto: ToDoItemUpdateDto) {
    return this.http.put(this.urlBase, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.urlBase}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
