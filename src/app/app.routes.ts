import { Routes } from '@angular/router';
import { ToDoListPageComponent } from './pages/to-do-list-page/to-do-list-page.component';

export const routes: Routes = [
  { path: 'to-do', component: ToDoListPageComponent },
  { path: '**', redirectTo: 'to-do' }
];
