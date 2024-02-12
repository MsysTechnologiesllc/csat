import { useState, useEffect } from "react";
import { MOBILE_WIDTH, DESKTOP_WIDTH } from "../common/constants";

export const useDetectMobileOrDesktop = () => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= MOBILE_WIDTH;
  const isTablet = width > MOBILE_WIDTH && width < DESKTOP_WIDTH;
  const isDesktop = width >= DESKTOP_WIDTH;

  return { isMobile, isTablet, isDesktop };
};
