import Link from "next/link";
import QuillEditor from "@/components/quill-editor";

export default function YjsQuillPage() {
  return (
    <div>
      <Link href="/yjs">&lt;- Go Back</Link>
      <QuillEditor />
      <p>Footer</p>
    </div>
  );
}
