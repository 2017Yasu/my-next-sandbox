import D3Drawer from "@/components/d3-drawer";
import Link from "next/link";

export default function DrawPage() {
  return (
    <div>
      <div
        style={{
          width: "800px",
          height: "500px",
          border: "2px solid",
          margin: "5px",
          backgroundColor: "white",
        }}
      >
        <D3Drawer />
      </div>
    </div>
  );
}
