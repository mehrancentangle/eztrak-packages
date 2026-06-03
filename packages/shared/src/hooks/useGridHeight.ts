import { useEffect, useState } from "react";

export interface UseGridHeightOptions {
  height?: string;
  headerId?: string;
  footerId?: string;
  offset?: number;
}

export const useGridHeight = ({
  height,
  headerId = "layout-header",
  footerId = "layout-footer",
  offset = 390,
}: UseGridHeightOptions = {}) => {
  const [gridHeight, setGridHeight] = useState(height || "300px");

  useEffect(() => {
    if (height) {
      setGridHeight(height);
      return;
    }

    const calculateHeight = () => {
      const header = document.getElementById(headerId);
      const footer = document.getElementById(footerId);

      const headerHeight = header ? header.offsetHeight : 0;
      const footerHeight = footer ? footer.offsetHeight : 0;
      const totalHeight = window.innerHeight;

      const remainingHeight = totalHeight - headerHeight - footerHeight - offset;
      setGridHeight(`${remainingHeight}px`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [height, headerId, footerId, offset]);

  return gridHeight;
};
