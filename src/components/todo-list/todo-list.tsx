"use client";

import { useEffectOnce, useTransaction } from "@/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import TodoItem from "./todo-item";

type TodoItemType = {
  id: string;
  done: boolean;
  description: string;
};

export default function TodoList() {
  const yDoc = useRef<Y.Doc | null>(null);
  const yArray = useRef<Y.Array<TodoItemType> | null>(null);
  const webrtc = useRef<WebrtcProvider | null>(null);

  const [todoList, setTodoList] = useState<Array<TodoItemType>>([]);

  const onYArrayChange = useCallback(
    (e: Y.YArrayEvent<TodoItemType>, tx: Y.Transaction) => {
      setTodoList(e.target.toArray());
    },
    [],
  );

  useEffectOnce(() => {
    yDoc.current = new Y.Doc();
    webrtc.current = new WebrtcProvider("todo-list-room", yDoc.current);
    yArray.current = yDoc.current.getArray<TodoItemType>("todo list");
    return () => {
      yDoc.current?.destroy();
      webrtc.current?.destroy();
    };
  });

  useEffect(() => {
    yArray.current?.observe(onYArrayChange);
    return () => {
      yArray.current?.unobserve(onYArrayChange);
    };
  }, [onYArrayChange]);

  const handleDoneChanged = useTransaction(
    yDoc,
    useCallback((index: number, done: boolean) => {
      if (!yArray.current || index >= yArray.current.length) {
        return;
      }
      const target = yArray.current.get(index);
      yArray.current.delete(index);
      yArray.current.insert(index, [{ ...target, done }]);
    }, []),
  );

  const handleDescriptionChanged = useTransaction(
    yDoc,
    useCallback((index: number, description: string) => {
      if (!yArray.current || index >= yArray.current.length) {
        return;
      }
      const target = yArray.current.get(index);
      yArray.current.delete(index);
      yArray.current.insert(index, [{ ...target, description }]);
    }, []),
  );

  const handleAddNewItem = useTransaction(
    yDoc,
    useCallback(() => {
      if (!yArray.current) {
        return;
      }
      yArray.current.push([
        {
          id: crypto.randomUUID(),
          done: false,
          description: "",
        },
      ]);
    }, []),
  );

  return (
    <div>
      {todoList.map((x, i) => (
        <TodoItem
          {...x}
          key={x.id}
          onDoneChange={(v) => handleDoneChanged(i, v)}
          onDescriptionChange={(v) => handleDescriptionChanged(i, v)}
        />
      ))}
      <div>
        <button onClick={handleAddNewItem}>Add</button>
      </div>
    </div>
  );
}
