'use client'

import Quill from "quill";
import QuillCursors from "quill-cursors";
import { useEffect, useRef } from "react";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default function QuillEditor() {
  const quill = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quill.current || !containerRef.current || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    Quill.register("modules/cursors", QuillCursors);
    quill.current = new Quill(containerRef.current, {
      modules: {
        cursors: true,
        toolbar: [
          // adding some basic Quill content features
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
        history: {
          // Local undo shouldn't undo changes
          // from remote users
          userOnly: true,
        },
      },
      placeholder: "Start collaborating...",
      theme: "snow", // 'bubble' is also great
    });
  }, []);

  return (
    <div className="editor">
      <p>This is quill editor</p>
      <div ref={containerRef} id="quill-editor" />
    </div>
  );
}
