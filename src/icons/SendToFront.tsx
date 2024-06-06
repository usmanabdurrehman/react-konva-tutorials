import React from "react";

export default function SendToFront() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{ transform: "rotate(180deg)" }}
    >
      <g stroke-width="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 10l0 10"></path>
        <path d="M12 10l4 4"></path>
        <path d="M12 10l-4 4"></path>
        <path d="M4 4l16 0"></path>
      </g>
    </svg>
  );
}
