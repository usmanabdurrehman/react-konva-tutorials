import React from "react";
import { IconProps } from "../types";
import { getIconColorProps } from "../utilities";

export default function Circle({ isSelected }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...getIconColorProps(isSelected)}
    >
      <g stroke-width="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="9"></circle>
      </g>
    </svg>
  );
}
