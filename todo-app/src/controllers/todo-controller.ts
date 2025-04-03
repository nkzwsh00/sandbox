import chalk from "chalk";
import { todoRepository } from "../repositories/todo-repository.js";
import { TodoCreateInput, TodoUpdateInput } from "../models/todo.js";

export class TodoController {
  async listTodos(): Promise<void> {
    const todos = await todoRepository.findAll();

    if (todos.length === 0) {
      console.log(chalk.yellow("タスクがありません。追加してみましょう！"));
      return;
    }

    console.log(chalk.bold("\nTODOリスト:"));
    console.log("-------------------");

    todos.forEach((todo) => {
      const status = todo.completed ? chalk.green("✓") : chalk.red("✗");

      const title = todo.completed ? chalk.dim(todo.title) : todo.title;

      const date = todo.createdAt.toLocaleDateString("ja-JP");

      console.log(`${status} [${todo.id}] ${title} (${date})`);
    });

    console.log("-------------------");
  }

  async getTodo(id: string): Promise<void> {
    const todo = await todoRepository.findById(id);

    if (!todo) {
      console.log(chalk.red(`ID: ${id} のタスクは見つかりませんでした。`));
      return;
    }

    const status = todo.completed
      ? chalk.green("完了")
      : chalk.yellow("未完了");

    console.log(chalk.bold("\nタスクの詳細:"));
    console.log("-------------------");
    console.log(`ID: ${todo.id}`);
    console.log(`タイトル: ${todo.title}`);
    console.log(`ステータス: ${status}`);
    console.log(`作成日: ${todo.createdAt.toLocaleString("ja-JP")}`);
    console.log("-------------------");
  }

  async createTodo(input: TodoCreateInput): Promise<void> {
    if (!input.title || input.title.trim() === "") {
      console.log(chalk.red("タイトルは必須です。"));
      return;
    }

    const newTodo = await todoRepository.create({
      title: input.title.trim(),
    });

    console.log(chalk.green(`"${newTodo.title}" を追加しました。`));
  }

  async updateTodo(id: string, input: TodoUpdateInput): Promise<void> {
    const todo = await todoRepository.findById(id);

    if (!todo) {
      console.log(chalk.red(`ID: ${id} のタスクは見つかりませんでした。`));
      return;
    }

    if (input.title !== undefined && input.title.trim() === "") {
      console.log(chalk.red("タイトルを空にすることはできません。"));
      return;
    }

    const updatedTodo = await todoRepository.update(id, {
      title: input.title?.trim(),
      completed: input.completed,
    });

    if (updatedTodo) {
      console.log(chalk.green(`ID: ${id} のタスクを更新しました。`));
    }
  }

  async toggleTodo(id: string): Promise<void> {
    const todo = await todoRepository.findById(id);

    if (!todo) {
      console.log(chalk.red(`ID: ${id} のタスクは見つかりませんでした。`));
      return;
    }

    const updatedTodo = await todoRepository.update(id, {
      completed: !todo.completed,
    });

    if (updatedTodo) {
      const status = updatedTodo.completed ? "完了" : "未完了";
      console.log(
        chalk.green(`"${updatedTodo.title}" を ${status} に設定しました。`)
      );
    }
  }

  async deleteTodo(id: string): Promise<void> {
    const deleted = await todoRepository.delete(id);

    if (deleted) {
      console.log(chalk.green(`ID: ${id} のタスクを削除しました。`));
    } else {
      console.log(chalk.red(`ID: ${id} のタスクは見つかりませんでした。`));
    }
  }
}

export const todoController = new TodoController();
