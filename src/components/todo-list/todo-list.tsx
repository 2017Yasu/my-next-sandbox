"use client";

import { useCallback, useState } from "react";
import TodoItem from "./todo-item";

export default function TodoList() {
  const [todoList, setTodoList] = useState([
    { id: "todo1", done: false, description: "todo 1" },
    { id: "todo2", done: true, description: "todo 2" },
    { id: "todo3", done: false, description: "todo 3" },
  ]);

  const onDoneStateChange = useCallback((index: number, done: boolean) => {
    setTodoList((x) => {
      const target = { ...x[index], done };
      return x
        .slice(0, index)
        .concat([target])
        .concat(x.slice(index + 1));
    });
  }, []);

  const onDescriptionChange = useCallback(
    (index: number, description: string) => {
      setTodoList((x) => {
        const target = { ...x[index], description };
        return x
          .slice(0, index)
          .concat([target])
          .concat(x.slice(index + 1));
      });
    },
    []
  );

  return (
    <div>
      {todoList.map((x, i) => (
        <TodoItem
          {...x}
          key={x.id}
          onDoneChange={(v) => onDoneStateChange(i, v)}
          onDescriptionChange={(v) => onDescriptionChange(i, v)}
        />
      ))}
    </div>
  );
}
