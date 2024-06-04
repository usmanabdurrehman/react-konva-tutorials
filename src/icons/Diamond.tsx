import React from "react";
import { IconProps } from "../types";
import { getIconColorProps } from "../utilities";

export default function Diamond({ isSelected }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      className=""
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...getIconColorProps(isSelected)}
    >
      <g stroke-width="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.5 20.4l-6.9 -6.9c-.781 -.781 -.781 -2.219 0 -3l6.9 -6.9c.781 -.781 2.219 -.781 3 0l6.9 6.9c.781 .781 .781 2.219 0 3l-6.9 6.9c-.781 .781 -2.219 .781 -3 0z"></path>
      </g>
    </svg>
  );
}
