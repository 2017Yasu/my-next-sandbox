import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("./quill-editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default QuillEditor;
