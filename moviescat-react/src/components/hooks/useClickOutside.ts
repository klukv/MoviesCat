import React from "react";

const useClickOutside = (
  elementRef: React.RefObject<HTMLDivElement>,
  handler: React.Dispatch<React.SetStateAction<boolean>>,
  attached = true
) => {
  React.useEffect(() => {
    const handleClickMenu = (event: MouseEvent) => {
      const _target = event.target as HTMLElement;
      if (!attached) return;
      if (elementRef.current && !elementRef.current.contains(_target)) {
        handler(false);
      }
    };

    document.body.addEventListener("click", handleClickMenu);

    return () => document.body.removeEventListener("click", handleClickMenu);
  }, [elementRef, handler, attached]);
};

export default useClickOutside;
