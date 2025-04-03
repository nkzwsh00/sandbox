import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import { TodoRepository } from "../src/repositories/todo-repository.js";
import { Todo } from "../src/models/todo.js";

// モック関数をセットアップ
vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
    mkdir: vi.fn(),
  },
}));

describe("TodoRepository", () => {
  let todoRepository: TodoRepository;
  const mockTodos: Todo[] = [
    {
      id: "1",
      title: "テストタスク1",
      completed: false,
      createdAt: new Date("2023-01-01"),
    },
    {
      id: "2",
      title: "テストタスク2",
      completed: true,
      createdAt: new Date("2023-01-02"),
    },
  ];

  beforeEach(() => {
    todoRepository = new TodoRepository();
    // モックをリセット
    vi.clearAllMocks();

    // fs.readFileのモック設定
    (fs.readFile as any).mockResolvedValue(JSON.stringify(mockTodos));
    // fs.accessのモック設定
    (fs.access as any).mockResolvedValue(undefined);
    // fs.mkdirのモック設定
    (fs.mkdir as any).mockResolvedValue(undefined);
    // fs.writeFileのモック設定
    (fs.writeFile as any).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("findAll", () => {
    it("すべてのTodoを取得できること", async () => {
      const todos = await todoRepository.findAll();
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe("テストタスク1");
      expect(todos[1].title).toBe("テストタスク2");
      expect(fs.readFile).toHaveBeenCalled();
    });

    it("ファイルが存在しない場合、空の配列を返すこと", async () => {
      (fs.readFile as any).mockRejectedValue(new Error("File not found"));
      const todos = await todoRepository.findAll();
      expect(todos).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("存在するIDのTodoを取得できること", async () => {
      const todo = await todoRepository.findById("1");
      expect(todo).not.toBeNull();
      expect(todo?.title).toBe("テストタスク1");
    });

    it("存在しないIDの場合、nullを返すこと", async () => {
      const todo = await todoRepository.findById("999");
      expect(todo).toBeNull();
    });
  });

  describe("create", () => {
    it("新しいTodoを作成できること", async () => {
      const newTodo = await todoRepository.create({ title: "新しいタスク" });
      expect(newTodo.title).toBe("新しいタスク");
      expect(newTodo.completed).toBe(false);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("存在するTodoを更新できること", async () => {
      const updatedTodo = await todoRepository.update("1", {
        title: "更新されたタスク",
        completed: true,
      });
      expect(updatedTodo).not.toBeNull();
      expect(updatedTodo?.title).toBe("更新されたタスク");
      expect(updatedTodo?.completed).toBe(true);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("存在しないTodoの場合、nullを返すこと", async () => {
      const updatedTodo = await todoRepository.update("999", {
        title: "更新されたタスク",
      });
      expect(updatedTodo).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("存在するTodoを削除できること", async () => {
      const result = await todoRepository.delete("1");
      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("存在しないTodoの場合、falseを返すこと", async () => {
      const result = await todoRepository.delete("999");
      expect(result).toBe(false);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
