import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LCornerFrameProps {
  children: ReactNode;
  className?: string;
  /** Show all 4 corners (default) or just top 2 */
  fullFrame?: boolean;
}

/**
 * L-Corner Brackets Component
 * Brand signature element with 8px Dandle Orange L-shaped corners
 * 
 * Specs (Desktop):
 * - Stroke: 8px
 * - Length: 55px each arm
 * - Inset: 40px from edges
 * - Color: Dandle Orange (#E67E22)
 * 
 * Specs (Mobile):
 * - Stroke: 4px
 * - Length: 35px each arm
 * - Inset: 20px from edges
 */
const LCornerFrame = ({ 
  children, 
  className,
  fullFrame = true 
}: LCornerFrameProps) => {
  return (
    <div className={cn("dandle-frame relative", className)}>
      {/* Top corners are handled by ::before and ::after pseudo-elements */}
      
      {/* Bottom corners - only render if fullFrame */}
      {fullFrame && (
        <>
          <div className="corner-bl" aria-hidden="true" />
          <div className="corner-br" aria-hidden="true" />
        </>
      )}
      
      {children}
    </div>
  );
};

export default LCornerFrame;
