import type { FieldValues, UseFormRegister } from 'react-hook-form';

interface ToggleButtonProps {
  leftLabel: string;
  rightLabel: string;
  fieldLabel: string;
  register: UseFormRegister<FieldValues>;
}

export const ToggleButton = ({ leftLabel, rightLabel, fieldLabel, register }: ToggleButtonProps) => (
  <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
    <input
      value={leftLabel}
      defaultChecked={true}
      type="radio"
      className="btn-check"
      id="btncheck1"
      autoComplete="off"
      {...register(fieldLabel)}
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
      {...register(fieldLabel)}
    />
    <label className="btn btn-outline-light" htmlFor="btncheck2">
      {rightLabel}
    </label>
  </div>
);
