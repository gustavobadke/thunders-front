import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import ToDoItemModel from '../../domain/models/to-do-item.model';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToDoService } from '../../services/to-do.service';

enum ToDoItemMode {
  View,
  Edit,
}

type ToDoItem = ToDoItemModel & { mode: ToDoItemMode };

@Component({
  selector: 'app-to-do-list-page',
  standalone: true,
  imports: [NgbAlertModule, FormsModule, CommonModule],
  templateUrl: './to-do-list-page.component.html',
  styleUrl: './to-do-list-page.component.scss',
})
export class ToDoListPageComponent implements OnInit {
  isLoading: boolean;
  toDoList: ToDoItem[];
  itemMode: typeof ToDoItemMode = ToDoItemMode;
  errors: {
    onCreate: string,
    onUpdate: string
  }

  @ViewChild('editItemForm') editItemForm!: NgForm;

  constructor(private todoService: ToDoService) {
    this.isLoading = false;
    this.toDoList = [];
    this.errors = {
      onCreate: '',
      onUpdate: ''
    }
  }

  ngOnInit(): void {
    console.log('init');
    this.loadToDoList();
  }

  async loadToDoList() {
    this.isLoading = true;
    
    this.todoService.list().subscribe(todos => {
      this.toDoList = todos.map(todo => ({ ...todo, mode: ToDoItemMode.View }))
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  create(ngForm: NgForm) {
    try {
      const { text, deadline } = ngForm.form.value;
      
      const createDto = {
        id: new Date().getTime(),
        text,
        isDone: false,
        deadline: deadline,
        mode: ToDoItemMode.View,
      } as ToDoItem
      
      this.validate(createDto)
      
      this.toDoList.push(createDto);

      this.todoService.create({
        id: createDto.id,
        text,
        deadlineDateISOFormat: deadline,
      }).subscribe(() => {
        ngForm.setValue({ text: '', deadline: null });

        this.errors.onCreate = ''
      });

    } catch(error) {
      this.errors.onCreate = (error instanceof Error) ? error.message : String(error)
    }
  }

  edit(index: number) {
    this.toDoList.forEach((m) => (m.mode = ToDoItemMode.View));

    this.toDoList[index].mode = ToDoItemMode.Edit;

    console.log(this.toDoList[index].deadline)

    setTimeout(()=>{
      this.editItemForm.setValue({ 
        text: this.toDoList[index].text, 
        deadline: this.formartDateToInput(this.toDoList[index].deadline)
      })
    })
  }

  formartDateToInput(date: string | null){
      if(!date) return ''
      return date.split('T')[0]
  }

  cancelEdit(index: number) {
    this.toDoList[index].mode = ToDoItemMode.View;
  }

  update(index: number, ngForm: NgForm) {
    try {
      const { id, isDone } = this.toDoList[index]
      const { deadline, text } = ngForm.form.value
      
      this.toDoList[index].text = text
      this.toDoList[index].deadline = deadline

      const updateDto = {
        id,
        deadline: deadline,
        isDone,
        text 
      } as ToDoItem

      this.validate(updateDto)

      this.todoService.update({
        id,
        deadlineDateISOFormat: deadline,
        isDone,
        text
      }).subscribe(()=>{
        this.toDoList[index].mode = ToDoItemMode.View;  

        this.errors.onUpdate = ''
      })      
    } catch(error) {
      console.log(error)
      this.errors.onUpdate = (error instanceof Error) ? error.message : String(error)
    }
  }

  toggleDone(index: number){
    this.toDoList[index].isDone = !this.toDoList[index].isDone

    const { id, deadline, isDone, text } = this.toDoList[index]

    this.todoService.update({
      id,
      deadlineDateISOFormat: deadline,
      isDone,
      text 
    }).subscribe()
  }

  remove(index: number){
    const { id } = this.toDoList[index]

    this.todoService.delete(id).subscribe(()=>{
      for (let i = 0; i < this.toDoList.length; i++) {
        if(this.toDoList[i].id === id) {
          this.toDoList.splice(i, 1)
          break
        }
      }
    })
  }

  validate(dto: ToDoItem) {
    if(dto.text === '' )
      throw Error('O conteúdo do que fazer está vazio')

    if(dto.deadline){
      const dateSplitted = dto.deadline?.split('-')

      const deadline = new Date(Number(dateSplitted[0]), Number(dateSplitted[1]) - 1, Number(dateSplitted[2])).getTime()
      const today = new Date()
      const todayInTimeMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

      if (deadline < todayInTimeMs) 
        throw Error('Não é possível atribuir uma data anterior a hoje')
    } 
  }
}
