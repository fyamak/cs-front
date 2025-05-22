"use client"
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef } from 'react';

const VirtualizedList: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const items = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    content: `Item ${i + 1}`
  }));

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '500px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={items[virtualItem.index].id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;