import React, { useRef } from "react";
import ReactGuides from "@scena/react-guides";

export default function Guides() {
  const horizonalGuidesRef = useRef(null);
  const verticalGuidesRef = useRef(null);

  return (
    <div
      onWheel={(e) => {
        const deltaX = e.deltaX;
        const deltaY = e.deltaY;
        const scrollX = horizonalGuidesRef.current?.getRulerScrollPos() + deltaX;
        const scrollY = verticalGuidesRef.current?.getRulerScrollPos() + deltaY;

        horizonalGuidesRef.current?.scrollGuides(scrollY);
        verticalGuidesRef.current?.scrollGuides(scrollX);
        horizonalGuidesRef.current?.scroll(scrollX);
        verticalGuidesRef.current?.scroll(scrollY);
      }}
    >
      <div className="ruler horizontal">
        <ReactGuides
          ref={horizonalGuidesRef}
          type="horizontal"
          rulerStyle={{
            left: "30px",
            width: "calc(100% - 30px)",
            height: "100%"
          }}
          displayDragPos={true}
          displayGuidePos={true}
          useResizeObserver={true}
        />
      </div>
      <div className="ruler vertical">
        <ReactGuides
          ref={verticalGuidesRef}
          type="vertical"
          rulerStyle={{
            top: "30px",
            height: "calc(100% - 30px)",
            width: "100%"
          }}
          displayDragPos={true}
          displayGuidePos={true}
          useResizeObserver={true}
        />
      </div>
    </div>
  );
}
