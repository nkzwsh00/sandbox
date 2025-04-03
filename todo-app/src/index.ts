#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { todoController } from "./controllers/todo-controller.js";
import { TodoCreateInput, TodoUpdateInput } from "./models/todo.js";

const program = new Command();

program
  .name("todo")
  .description("TypeScriptで作成されたシンプルなTODOアプリ")
  .version("0.1.0");

program
  .command("list")
  .description("すべてのタスクを一覧表示")
  .action(async () => {
    await todoController.listTodos();
  });

program
  .command("get")
  .description("IDでタスクを取得")
  .argument("<id>", "タスクID")
  .action(async (id) => {
    await todoController.getTodo(id);
  });

program
  .command("add")
  .description("新しいタスクを追加")
  .option("-t, --title <title>", "タスクのタイトル")
  .action(async (options) => {
    const input: TodoCreateInput = options.title
      ? { title: options.title }
      : await inquirer.prompt([
          {
            type: "input",
            name: "title",
            message: "タスクのタイトルを入力してください:",
            validate: (input) => (input.trim() ? true : "タイトルは必須です"),
          },
        ]);

    await todoController.createTodo(input);
  });

program
  .command("update")
  .description("タスクを更新")
  .argument("<id>", "タスクID")
  .option("-t, --title <title>", "新しいタイトル")
  .option("-c, --completed <state>", "完了状態 (true/false)")
  .action(async (id, options) => {
    if (!options.title && options.completed === undefined) {
      const todo = await todoController.getTodo(id);
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "新しいタイトル (変更しない場合は空白):",
        },
        {
          type: "confirm",
          name: "toggleStatus",
          message: "完了状態を切り替えますか?",
          default: false,
        },
      ]);

      const input: TodoUpdateInput = {};
      if (answers.title.trim()) {
        input.title = answers.title;
      }
      if (answers.toggleStatus) {
        await todoController.toggleTodo(id);
        return;
      }

      if (Object.keys(input).length > 0) {
        await todoController.updateTodo(id, input);
      } else {
        console.log(chalk.yellow("変更はありませんでした。"));
      }
    } else {
      const input: TodoUpdateInput = {};
      if (options.title) {
        input.title = options.title;
      }
      if (options.completed !== undefined) {
        input.completed = options.completed === "true";
      }
      await todoController.updateTodo(id, input);
    }
  });

program
  .command("toggle")
  .description("タスクの完了状態を切り替え")
  .argument("<id>", "タスクID")
  .action(async (id) => {
    await todoController.toggleTodo(id);
  });

program
  .command("delete")
  .description("タスクを削除")
  .argument("<id>", "タスクID")
  .option("-f, --force", "確認なしで削除")
  .action(async (id, options) => {
    if (!options.force) {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `ID: ${id} のタスクを削除してもよろしいですか?`,
          default: false,
        },
      ]);

      if (!answer.confirm) {
        console.log(chalk.yellow("削除をキャンセルしました。"));
        return;
      }
    }

    await todoController.deleteTodo(id);
  });

// デフォルトでリスト表示
if (process.argv.length <= 2) {
  todoController.listTodos().catch(console.error);
} else {
  program.parse();
}
