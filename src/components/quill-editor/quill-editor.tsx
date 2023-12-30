"use client";

import Quill from "quill";
import QuillCursors from "quill-cursors";
import { useEffect, useRef } from "react";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default function QuillEditor() {
  const quill = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      quill.current ||
      !containerRef.current ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    // Initialize quill
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

    // Initialize shared document
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("quill");
    const provider = new WebrtcProvider("quill-demo-room", yDoc);

    // Initialize awareness
    const awareness = provider.awareness;
    awareness.on('change', () => {
      console.log(Array.from(awareness.getStates().values()));
    })
    awareness.setLocalStateField("user", {
      name: Math.random(),
      color: "#ffb61e",
    });

    // Bind to editor
    const binding = new QuillBinding(yText, quill.current, awareness);
  }, []);

  return (
    <div className="editor">
      <p>This is quill editor</p>
      <div ref={containerRef} id="quill-editor" />
    </div>
  );
}
