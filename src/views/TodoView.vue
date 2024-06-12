<template>
  <div class="container">
    <h2>C'est la page des todos :)</h2>
    <label for="showAllTodos">Voir tous les todos</label>
    <input type="checkbox" id="showAllTodos" v-model="show" />
    <br />
    <label for="newTodo"></label><input type="text" id="newTodo" v-model="todoTitle" />
    <button type="button" @click="addTodo">Ajouter</button>
    <br />
    <TodoList :showAll="show"></TodoList>
    <button type="button" @click="save">Sauver</button>
    <br />
    <button type="button" @click="load">Charger</button>
  </div>
</template>
<script setup lang="ts">
import TodoList from '@/components/TodoList.vue';
import { useTodoListStore } from '@/stores/todolist';
import axiosInstance from '@/modules/axios';
import { ref, type Ref } from 'vue';
import type { Todo } from '@/models/Todo';
import { saveTodos, loadTodos } from '@/utils/indexedDB';

const show = ref<boolean>(true);
const todoStore = useTodoListStore();
const todoTitle: Ref<string> = ref('');

function addTodo() {
  todoStore.createTodo(todoTitle.value);
  todoTitle.value = '';
}

async function save() {
  console.log('e')
  try {
    await saveTodos(todoStore.todoList);
    console.log('Todos saved to IndexedDB');
  } catch (error) {
    console.error('Failed to save todos to IndexedDB', error);
  }
}

async function load() {
  try {
    const todos = await loadTodos();
    if (todos.length > 0) {
      todoStore.todoList = todos;
      console.log('Todos loaded from IndexedDB');
    } else {
      console.log('Début de la requête');
      const response = await axiosInstance.get<Todo[]>('/todos');
      console.log('résolution de la promesse');
      console.log(response.data);
      todoStore.todoList = response.data;
      await saveTodos(response.data);
    }
  } catch (error) {
    console.error('Failed to load todos from IndexedDB or API', error);
  } finally {
    console.log('Bout de code toujours executé');
  }
}
</script>