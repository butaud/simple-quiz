import { useAccount } from "jazz-react";
import { FC } from "react";
import { AVATAR_COLORS } from "./schema";

import "./Form.css";

export function Form() {
  const { me } = useAccount({ resolve: { profile: true, root: true } });

  if (!me) return null;

  return (
    <div className="grid gap-4 border p-8">
      <div className="flex items-center gap-3">
        <label htmlFor="name" className="sm:w-32">
          First name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name here..."
          className="border border-stone-300 rounded shadow-sm py-1 px-2 flex-1"
          value={me.profile.name || ""}
          onChange={(e) => (me.profile.name = e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <label htmlFor="color" className="sm:w-32">
          Avatar color
        </label>
        <ColorPicker />
      </div>
    </div>
  );
}

const ColorPicker: FC = () => {
  const { me } = useAccount();
  return (
    <div className="color-picker-container">
      {AVATAR_COLORS.map((color) => {
        const selected = color === me.profile?.color;
        const classNames = ["color"];
        if (selected) {
          classNames.push("selected");
        }
        return (
          <button
            key={color}
            className={classNames.join(" ")}
            style={{ backgroundColor: color }}
            type="button"
            onClick={() => {
              if (!selected && me.profile) {
                me.profile.color = color;
              }
            }}
          />
        );
      })}
    </div>
  );
};
