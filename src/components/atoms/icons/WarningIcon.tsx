import { cssColorVar } from "../../../shared/design-system/util";
import type { SemanticColors } from "../../../shared/design-system/model";

interface WarningIconProps {
  size: number;
  color: SemanticColors;
}

function WarningIcon({ size, color }: WarningIconProps) {
  const cssColor = cssColorVar(color);
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      height={size} 
      viewBox="0 -960 960 960" 
      width={size} 
      fill={cssColor}
      aria-hidden="true"
    >
      <path d="m40-120 440-760q17-30 45-45t58-15q30 0 57 15t45 45l440 760q17 30 1.5 58T920-80H80q-26 0-41.5-28T40-120Zm60 0h760L520-560 260-120Zm260-80h120v-120H560v120Zm0-160h120v-240H560v240Z" />
    </svg>
  );
}

export default WarningIcon;