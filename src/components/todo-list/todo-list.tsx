"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import TodoItem from "./todo-item";

type TodoItemType = {
  id: string;
  done: boolean;
  description: string;
};

export default function TodoList() {
  const initialized = useRef(false);
  const yDoc = useRef<Y.Doc | null>(null);
  const yArray = useRef<Y.Array<TodoItemType> | null>(null);
  const webrtc = useRef<WebrtcProvider | null>(null);

  const [todoList, setTodoList] = useState<Array<TodoItemType>>([]);

  const onYArrayChange = useCallback(
    (e: Y.YArrayEvent<TodoItemType>, tx: Y.Transaction) => {
      console.log("yArray changed");
      setTodoList(e.target.toArray());
    },
    []
  );

  useEffect(() => {
    console.log("initializing");
    if (initialized.current) {
      console.log("it has already initialized");
      return;
    }
    initialized.current = true;
    yDoc.current = new Y.Doc();
    webrtc.current = new WebrtcProvider("todo-list-room", yDoc.current);
    yArray.current = yDoc.current.getArray<TodoItemType>("todo list");
    console.log("initialized");
  }, []);

  useEffect(() => {
    yArray.current?.observe(onYArrayChange);
    return () => {
      yArray.current?.unobserve(onYArrayChange);
    };
  }, [onYArrayChange]);

  const onDoneStateChange = useCallback((index: number, done: boolean) => {
    // setTodoList((x) => {
    //   const target: TodoItemType = { ...x[index], done };
    //   return x
    //     .slice(0, index)
    //     .concat([target])
    //     .concat(x.slice(index + 1));
    // });
  }, []);

  const onDescriptionChange = useCallback(
    (index: number, description: string) => {
      // setTodoList((x) => {
      //   const target: TodoItemType = { ...x[index], description };
      //   return x
      //     .slice(0, index)
      //     .concat([target])
      //     .concat(x.slice(index + 1));
      // });
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
      <div>
        <button
          onClick={() => {
            yArray.current?.push([
              {
                id: Math.random().toString(),
                done: false,
                description: Math.random().toString(),
              },
            ]);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
