"use client";

import { ChangeEvent, useCallback } from "react";

export default function TodoItem({
  id,
  done = false,
  description,
  onDoneChange,
  onDescriptionChange,
}: {
  id: string;
  done: boolean;
  description: string;
  onDoneChange?: (v: boolean) => void;
  onDescriptionChange?: (v: string) => void;
}) {
  const onCheckStateChange = useCallback(() => {
    if (onDoneChange) {
      onDoneChange(!done);
    }
  }, [done, onDoneChange]);

  const onTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onDescriptionChange) {
        onDescriptionChange(e.target.value);
      }
    },
    [onDescriptionChange]
  );

  return (
    <div style={{ display: "flex", margin: "5px" }}>
      <input
        onChange={onCheckStateChange}
        style={{ margin: "5px" }}
        type="checkbox"
        checked={done}
      />
      <input onChange={onTextChange} value={description} />
    </div>
  );
}
