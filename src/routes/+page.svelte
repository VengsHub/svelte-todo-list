<script>
  import {todoList} from "../lib/todo-list.ts";
  import {writable} from "svelte/store";

  const newTodo = writable('');

  const mousePosition = writable({x: 0, y: 0});
  const draggingElement = writable();
  const movingTodo = writable();
  const dragStartPosition = writable({x: 0, y: 0});
  // save initial drag position and calculate difference to current mouseposition
  // on mouse enter if html element, reorder list
  $: if ($draggingElement) $draggingElement.style.translate = `${$mousePosition.x - $dragStartPosition.x}px ${$mousePosition.y - $dragStartPosition.y}px`;

  $: console.log('drag start at', $dragStartPosition);
  $: console.log('todo list', [...$todoList]);
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<section on:mousemove={event => $mousePosition = {x: event.clientX, y: event.clientY}}
         on:mouseup={() => $draggingElement = undefined}>
    <h1>Todo-list</h1>
    <div class="new-todo">
        <input type="text" bind:value={$newTodo}>
        <button on:click={() => todoList.addTodo({text: $newTodo, done: false})}>Add</button>
    </div>

    {#each $todoList as todo, index}
        <div class="todo-container" on:mouseenter={() => $movingTodo ? todoList.moveTodo($movingTodo, index): null}>
            <div class="todo"
                 on:mousedown={e => {$movingTodo = {...todo}; $draggingElement = e.currentTarget; $dragStartPosition = {x: e.x, y: e.y}}}>
			<span class="checkbox" class:done={todo.done}
                  on:click={e => todoList.updateTodoStatus({...todo, done: !todo.done})}>
			</span>
                <span class:checked={todo.done}>{todo.text}</span>
                <span class="remove-button" on:click={() => todoList.removeTodo(todo)}>❌</span>
            </div>
        </div>
    {/each}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        flex: 0.6;
    }

    .new-todo, .new-todo * {
        height: 30px;
    }

    .todo-container {
        border: 1px solid slategrey;
        border-radius: 4px;
    }

    .todo {
        border: 1px solid slategrey;
        border-radius: 4px;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
    }

    .checkbox {
        width: 20px;
        height: 20px;
        border: 1px solid slategrey;
        border-radius: 4px;
        cursor: pointer;
    }

    .done {
        background-color: #4075a6;
    }

    .checked {
        text-decoration: line-through;
    }

    .remove-button {
        cursor: pointer;
    }
</style>
