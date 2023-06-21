import { writable } from 'svelte/store';

export interface Todo {
  text: string;
  done: boolean;
}

function createTodoList(initial: Todo[] = []) {
  const { subscribe, set, update } = writable<Todo[]>(initial);

  return {
    subscribe,
    addTodo: (newTodo: Todo) => update(todos => todos.concat(newTodo)),
    updateTodoStatus: (todoWithNewStatus: Todo) => update(todos =>
        todos.map(todo => todo.text === todoWithNewStatus.text ? todoWithNewStatus : todo)
    ),
    removeTodo: (todoToRemove: Todo) => update(todos =>
        todos.filter(todo => todo.text !== todoToRemove.text)
    ),
    moveTodo: (todoToMove: Todo, position: number) => update(todos => {
      const movedTodoIndex = todos.findIndex(todo => todo.text === todoToMove.text);
      todos.splice(movedTodoIndex, 1);
      todos.splice(position, 0, todoToMove);
      return todos;
    })
  };
}

export const todoList = createTodoList([
  {text: 'My first todo', done: true},
  {text: 'My second todo', done: false},
  {text: 'My third todo', done: false}
]);
