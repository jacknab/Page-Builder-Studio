import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (value: string) => void;
  as?: React.ElementType;
  preview?: boolean;
}

export function EditableText({ value, onChange, as: Component = 'div', preview, className, ...props }: EditableTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (textRef.current && textRef.current.innerText !== value) {
      textRef.current.innerText = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    onChange(e.currentTarget.innerText);
  };

  return (
    <Component
      ref={textRef}
      contentEditable={!preview}
      suppressContentEditableWarning
      onBlur={handleInput}
      className={cn(
        'outline-none focus:ring-2 focus:ring-primary/50 focus:bg-primary/5 rounded transition-colors',
        !preview && 'hover:bg-primary/5 cursor-text',
        className
      )}
      {...props}
    />
  );
}
