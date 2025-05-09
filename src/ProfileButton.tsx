import { FC, useState } from "react";
import "./ProfileButton.css";
import { MdClose } from "react-icons/md";
import { useAccount } from "jazz-react";
import { AVATAR_COLORS } from "./schema";
import { Avatar } from "./Avatar";

export const ProfileButton: FC<{}> = () => {
  const { me } = useAccount();
  const [expanded, setExpanded] = useState(false);

  if (!me.profile) {
    return null;
  }

  return (
    <>
      <Avatar
        profile={me.profile}
        as="button"
        onClick={() => setExpanded(!expanded)}
      />
      {expanded && <ProfileEditor close={() => setExpanded(false)} />}
    </>
  );
};

type ProfileEditorProps = { close: () => void };
export const ProfileEditor: FC<ProfileEditorProps> = ({ close }) => {
  const { me } = useAccount();

  return (
    <div
      className="profile-editor-container"
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <button className="subtle close" onClick={close} title="Close">
        <MdClose />
      </button>
      <form className="profile-editor">
        <label>Display Name</label>
        <div className="form-line">
          <input
            autoFocus
            type="text"
            value={me.profile?.name}
            onChange={(e) => {
              if (me.profile) {
                me.profile.name = e.target.value;
              }
            }}
          />
        </div>
        <label>Avatar Color</label>
        <div className="form-line">
          <ColorPicker />
        </div>
        {/* <AuthButton username={me.profile?.name ?? ""} /> */}
      </form>
    </div>
  );
};

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
