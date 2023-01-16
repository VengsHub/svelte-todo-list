<script lang="ts">
  import { todoList } from '../lib/todo-list.ts';
  import type { Todo } from '../lib/todo-list.ts';
  import {writable} from "svelte/store";

  const newTodo = writable('');

  const mousePosition = writable({x: 0, y: 0});
  const movingTodo = writable<Todo>();
  let draggingElement: HTMLElement;
  $: if (draggingElement) {
    draggingElement.style.translate = `${$mousePosition.x}px ${$mousePosition.y}px`;
  }

  $: console.log('todo list', [...$todoList]);
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

{#if $movingTodo}
    <div class="moving-todo" bind:this={draggingElement}>
        <span class:checked={$movingTodo.done}>{$movingTodo.text}</span>
    </div>
{/if}

<section on:mousemove={event => $mousePosition = {x: event.clientX, y: event.clientY}}
         on:mouseup={() => $movingTodo = undefined}>
    <h1>Todo-list</h1>
    <div class="new-todo">
        <input type="text" bind:value={$newTodo}>
        <button on:click={() => todoList.addTodo({text: $newTodo, done: false})}>Add</button>
    </div>

    {#each $todoList as todo, index}
        <div class="todo-container" on:mouseenter={() => $movingTodo ? todoList.moveTodo($movingTodo, index): null}>
            {#if !$movingTodo || todo.text !== $movingTodo.text}
                <div class="todo">
			        <span class="checkbox" class:done={todo.done}
                          on:click={e => todoList.updateTodoStatus({...todo, done: !todo.done})}>
                    </span>
                    <span class="todo-text" class:checked={todo.done} on:mousedown={() => $movingTodo = {...todo}}>
                        <p>{todo.text}</p>
                    </span>
                    <span class="remove-button" on:click={() => todoList.removeTodo(todo)}>❌</span>
                </div>
            {/if}
        </div>
    {/each}
</section>

<style lang="scss">
    .moving-todo {
        width: clamp(500px, 50%, 800px);
        height: 50px;
        position: absolute;
        pointer-events: none;
    }

    section {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        flex: 0.6;

      .todo-container {
        border: 1px solid slategrey;
        border-radius: 4px;
        width: clamp(500px, 50%, 800px);
        height: 50px;

        .todo {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 1px solid slategrey;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          user-select: none;

          .checkbox {
            width: 20px;
            height: 20px;
            border: 1px solid slategrey;
            border-radius: 4px;
            cursor: pointer;

            &.done {
              background-color: #4075a6;
            }
          }

          .todo-text {
            height: 100%;
            width: 100%;
            cursor: grab;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
              text-align: center;

              &.checked {
                text-decoration: line-through;
              }
            }
          }

          .remove-button {
            cursor: pointer;
          }
        }
      }
    }
</style>
