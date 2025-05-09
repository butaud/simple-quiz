import { createElement } from "react";
import "./Avatar.css";
import { AVATAR_COLORS, JazzProfile } from "./schema";
import { Resolved } from "jazz-tools";

export type AvatarProps = {
  profile: Resolved<JazzProfile, true>;
  as: "button" | "div";
  onClick?: () => void;
  size?: "small" | "medium";
};

export function Avatar({ profile, as, onClick, size = "medium" }: AvatarProps) {
  return createElement(
    as,
    {
      className: `avatar ${size}`,
      style: {
        backgroundColor: profile.color ?? AVATAR_COLORS[0],
      },
      onClick,
    },
    profile.name
      .split(" ")
      .slice(0, 2)
      .map((n: string) => n[0])
      .join("")
  );
}
