import { useEffect, useState } from 'react';

export const useClickToOpen = (elementId: string, defaultOpen: boolean, resetKey?: string) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [resetKey, defaultOpen]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const element = document.getElementById(elementId);
      if (element && element.contains(event.target as Node)) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [elementId]);

  return [isOpen, setIsOpen] as const;
};
