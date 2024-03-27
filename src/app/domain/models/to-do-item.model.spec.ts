import { ToDoItemModel } from './to-do-item.model';

describe('ToDoItem', () => {
  it('should create an instance', () => {
    expect(new ToDoItemModel()).toBeTruthy();
  });
});
