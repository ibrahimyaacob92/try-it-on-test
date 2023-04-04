import React from "react";

type Props = {
  size: number;
  onChange: (size: number) => void;
};

const EraserSizeController = ({ size, onChange }: Props) => {
  return (
    <input
      onChange={(e) => onChange(Number(e.target.value))}
      type="range"
      min="1"
      max="100"
      value={size}
      id="myRange"
    />
  );
};

export default EraserSizeController;
