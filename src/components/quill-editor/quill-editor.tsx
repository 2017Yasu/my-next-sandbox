"use client";

import Quill from "quill";
import QuillCursors from "quill-cursors";
import { useRef } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { useEffectOnce } from "@/hooks";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

Quill.register("modules/cursors", QuillCursors);

export default function QuillEditor() {
  const quill = useRef<Quill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const yDoc = useRef<Y.Doc | null>(null);
  const yText = useRef<Y.Text | null>(null);
  const webrtc = useRef<WebrtcProvider | null>(null);
  const indexDB = useRef<IndexeddbPersistence | null>(null);
  const binding = useRef<QuillBinding | null>(null);

  useEffectOnce(() => {
    if (!containerRef.current) {
      return;
    }

    // Initialize quill
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
    yDoc.current = new Y.Doc();
    yText.current = yDoc.current.getText("quill");
    webrtc.current = new WebrtcProvider("quill-demo-room", yDoc.current);
    indexDB.current = new IndexeddbPersistence("quill-demo-room", yDoc.current);

    // Initialize awareness
    const awareness = webrtc.current.awareness;
    awareness.on("change", () => {
      console.log(Array.from(awareness.getStates().values()));
    });
    awareness.setLocalStateField("user", {
      name: Math.random(),
      color: "#ffb61e",
    });

    indexDB.current.once("synced", () => {
      console.log("initial content loaded");
    });

    // Bind to editor
    binding.current = new QuillBinding(yText.current, quill.current, awareness);

    return () => {
      yDoc.current?.destroy();
      webrtc.current?.destroy();
      indexDB.current?.destroy();
      binding.current?.destroy();
    };
  });

  return (
    <div className="editor">
      <p>This is quill editor</p>
      <div ref={containerRef} id="quill-editor" />
    </div>
  );
}
