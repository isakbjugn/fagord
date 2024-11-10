interface Props {
  leftLabel: string;
  rightLabel: string;
  name: string;
  handleChange: (value: string) => void;
}

export const ToggleButton = ({ leftLabel, rightLabel, name, handleChange }: Props) => (
  <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
    <input
      value={leftLabel}
      defaultChecked={true}
      type="radio"
      className="btn-check"
      id="btncheck1"
      autoComplete="off"
      name={name}
      onChange={() => {
        handleChange(leftLabel);
      }}
    />
    <label className="btn btn-outline-light" htmlFor="btncheck1">
      {leftLabel}
    </label>

    <input
      value={rightLabel}
      type="radio"
      className="btn-check"
      id="btncheck2"
      autoComplete="off"
      name={name}
      onChange={() => {
        handleChange(rightLabel);
      }}
    />
    <label className="btn btn-outline-light" htmlFor="btncheck2">
      {rightLabel}
    </label>
  </div>
);
