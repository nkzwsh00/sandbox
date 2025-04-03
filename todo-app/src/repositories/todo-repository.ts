import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Todo, TodoCreateInput, TodoUpdateInput } from "../models/todo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = path.join(__dirname, "../../data/todos.json");

export class TodoRepository {
  private todos: Todo[] = [];
  private initialized = false;

  private async ensureDataDir(): Promise<void> {
    const dataDir = path.dirname(DATA_FILE_PATH);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private async loadTodos(): Promise<void> {
    if (this.initialized) return;

    await this.ensureDataDir();

    try {
      const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
      const parsedData = JSON.parse(data);
      this.todos = parsedData.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    } catch (error) {
      // ファイルが存在しない場合は空の配列を使用
      this.todos = [];
    }

    this.initialized = true;
  }

  private async saveTodos(): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(this.todos, null, 2),
      "utf-8"
    );
  }

  async findAll(): Promise<Todo[]> {
    await this.loadTodos();
    return [...this.todos];
  }

  async findById(id: string): Promise<Todo | null> {
    await this.loadTodos();
    return this.todos.find((todo) => todo.id === id) || null;
  }

  async create(input: TodoCreateInput): Promise<Todo> {
    await this.loadTodos();

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: input.title,
      completed: false,
      createdAt: new Date(),
    };

    this.todos.push(newTodo);
    await this.saveTodos();

    return newTodo;
  }

  async update(id: string, input: TodoUpdateInput): Promise<Todo | null> {
    await this.loadTodos();

    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...input,
    };

    this.todos[todoIndex] = updatedTodo;
    await this.saveTodos();

    return updatedTodo;
  }

  async delete(id: string): Promise<boolean> {
    await this.loadTodos();

    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.id !== id);

    if (this.todos.length === initialLength) {
      return false;
    }

    await this.saveTodos();
    return true;
  }
}

export const todoRepository = new TodoRepository();
