'use client'
import React, { useRef, useEffect } from "react";
import InfiniteViewer from "react-infinite-viewer";

export default function Viewer ({ children }: { children: React.ReactNode }) {
  const viewerRef = useRef<InfiniteViewer>(null)

  useEffect(() => {
    // eslint-disable-next-line
    // @ts-ignore
    viewerRef.current?.infiniteViewer?.setZoom(0.8)
  }, [])

  return (
    <div className="containerx">
      <InfiniteViewer
        ref={viewerRef}
        className="iv"
        onPinch={(e) => {
          // eslint-disable-next-line
          // @ts-ignore
          viewerRef.current?.infiniteViewer?.setZoom(e.zoom, {
            zoomOffsetX: e.clientX,
            zoomOffsetY: e.clientY
          })
        }}
      >
        <div className="viewport">
          {children}
        </div>
      </InfiniteViewer>
    </div>
  );
}