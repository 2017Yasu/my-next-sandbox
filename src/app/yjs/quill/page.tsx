import Link from "next/link";
import QuillEditor from "@/components/quill-editor";

export default function YjsQuillPage() {
  return (
    <div>
      <Link href="/">&lt;- Go Back</Link>
      <QuillEditor />
      <p>Footer</p>
    </div>
  );
}
