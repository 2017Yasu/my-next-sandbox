import dynamic from "next/dynamic";

const TodoList = dynamic(() => import("./todo-list"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default TodoList;
