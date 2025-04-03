export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoCreateInput = {
  title: string;
};

export type TodoUpdateInput = {
  title?: string;
  completed?: boolean;
};
