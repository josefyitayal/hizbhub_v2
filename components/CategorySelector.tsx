import React, { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { categories } from '@/constants';
import { HugeiconsIcon } from '@hugeicons/react';

type CategorySelectorProps = {
    value: string | undefined;
    onChange: Dispatch<SetStateAction<string | undefined>>;
}

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
    // Internal Data

    const [isHovering, setIsHovering] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Triple the items to create the infinite loop buffer: [Set 1] [Set 2] [Set 3]
    const loopedItems = [...categories, ...categories, ...categories];

    /**
     * Handle Item Selection
     * Updates state and centers the clicked item to ensure visibility.
     */
    const handleSelect = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onChange(id);

        // Fix: Scroll the clicked element to the center of the view
        e.currentTarget.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    };

    /**
     * Handle Mouse Wheel Scrolling
     * Translates vertical scroll (wheel) to horizontal scroll.
     */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (!isHovering) return;
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        };

        // Note: We use a native event listener here to support { passive: false }
        // which allows us to prevent the default vertical page scroll
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [isHovering]);

    /**
     * Infinite Loop Logic
     * seamless snap-back when scrolling hits the buffer zones.
     */
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const totalScrollWidth = container.scrollWidth;
        const oneSetWidth = totalScrollWidth / 3;

        // Snap back to the middle set if we scroll too far right
        if (container.scrollLeft >= 2 * oneSetWidth) {
            container.scrollLeft = container.scrollLeft - oneSetWidth;
        }
        // Snap forward to the middle set if we scroll too far left
        // We add a small buffer (10px) to ensure smooth snapping logic
        else if (container.scrollLeft <= 10) {
            container.scrollLeft = container.scrollLeft + oneSetWidth;
        }
    }, []);

    /**
     * Initial Setup
     * Starts the user in the middle set (Set 2) so they can scroll both ways immediately.
     */
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const oneSetWidth = container.scrollWidth / 3;
            container.scrollLeft = oneSetWidth;
        }
    }, []); // Run once on mount

    return (
        <div
            className="w-full max-w-4xl mx-auto group py-3"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative">
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex items-center gap-3 overflow-x-auto px-8 select-none no-scrollbar"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                    }}
                >
                    {loopedItems.map((item, index) => {
                        // We use index in the key because IDs are duplicated in the loop
                        const uniqueKey = `${item.id}-${index}`;
                        const isSelected = value === item.id;

                        return (
                            <button
                                key={uniqueKey}
                                onClick={(e) => handleSelect(item.id, e)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap",
                                    isSelected
                                        ? "bg-primary text-black border-border shadow-md "
                                        : "text-muted-foreground border-border hover:bg-secondary hover:border-ring hover:text-zinc-200"
                                )}
                            >
                                {/* Render icon if it exists */}
                                {item.icon && (
                                    <HugeiconsIcon
                                        icon={item.icon} // Pass the data object here
                                        size={16}
                                        className={cn("transition-colors", isSelected ? "text-black" : "text-muted-foreground")}
                                    />
                                )}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default CategorySelector;
