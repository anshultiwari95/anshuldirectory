declare module 'react-text-mask' {
  import { ComponentType, InputHTMLAttributes } from 'react';

  interface MaskedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: (string | RegExp)[];
    guide?: boolean;
    placeholderChar?: string;
    keepCharPositions?: boolean;
    showMask?: boolean;
  }

  const MaskedInput: ComponentType<MaskedInputProps>;

  export default MaskedInput;
} 