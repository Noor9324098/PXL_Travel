import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const PageTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lottieRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);
  const lottieElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentPathname = location.pathname;
    
    // Don't show transition on initial page load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousPathnameRef.current = currentPathname;
      return;
    }

    // Only show transition if pathname actually changed
    if (previousPathnameRef.current === currentPathname) {
      return;
    }

    // Update previous pathname
    previousPathnameRef.current = currentPathname;

    // Clean up any existing timeout and animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (lottieElementRef.current && lottieElementRef.current.parentNode) {
      lottieElementRef.current.parentNode.removeChild(lottieElementRef.current);
    }

    // Show transition animation
    setIsTransitioning(true);

    // Small delay to ensure DOM is ready
    const setupTimeout = setTimeout(() => {
      // Create Lottie element
      if (lottieRef.current) {
        // Clear previous content
        lottieRef.current.innerHTML = "";

        try {
          const lottieElement = document.createElement("dotlottie-wc");
          lottieElement.setAttribute(
            "src",
            "https://lottie.host/c842b2e5-e248-48b4-ad54-58692ab55d40/PvLhtiWsWT.lottie"
          );
          lottieElement.setAttribute("autoplay", "");
          lottieElement.setAttribute("loop", "");
          lottieElement.style.width = "300px";
          lottieElement.style.height = "300px";
          lottieElement.style.margin = "0 auto";

          lottieRef.current.appendChild(lottieElement);
          lottieElementRef.current = lottieElement;

          // Hide transition after animation completes
          timeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            // Clean up Lottie element
            if (lottieElementRef.current && lottieElementRef.current.parentNode) {
              lottieElementRef.current.parentNode.removeChild(lottieElementRef.current);
              lottieElementRef.current = null;
            }
          }, 6000); // Show for 6 seconds
        } catch (error) {
          console.error("Error loading Lottie animation:", error);
          // If animation fails to load, hide transition after a short delay
          timeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }
      }
    }, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (setupTimeout) {
        clearTimeout(setupTimeout);
      }
      // Ensure transition is cleared on unmount
      setIsTransitioning(false);
    };
  }, [location.pathname, location.key]);

  if (!isTransitioning) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md page-transition-fade-in"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div ref={lottieRef} className="flex items-center justify-center" style={{ pointerEvents: 'auto' }}></div>
    </div>
  );
};

