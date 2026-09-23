import { ImagePlus, Loader2 } from "lucide-react";
import { frameLayout, frameSizeRatio, type FrameBorder } from "@/lib/products";

type Props = {
  size: string;
  layout: string;
  border: FrameBorder | null;
  photos: (string | null | undefined)[];
  /** When provided, each slot becomes a click target for uploading that slot's photo. */
  onSlotClick?: (index: number) => void;
  uploadingSlot?: number | null;
};

/**
 * Live mockup of the customer's frame: the outer border comes from the
 * admin-defined border style, the shape from the chosen size and the photo
 * arrangement from the chosen layout. Each slot can be filled individually.
 */
export function FramePreview({ size, layout, border, photos, onSlotClick, uploadingSlot }: Props) {
  const { slots, cols } = frameLayout(layout);
  const ratio = frameSizeRatio(size);
  const width = border ? Math.min(28, Math.max(4, border.width)) : 10;

  return (
    <div
      className="mx-auto w-full max-w-sm rounded-sm shadow-lg transition-all duration-300"
      style={{
        aspectRatio: String(ratio),
        background: border?.color ?? "#5a3a22",
        padding: `${width}px`,
      }}
    >
      <div className="size-full bg-card p-2">
        <div
          className="grid size-full gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: slots }).map((_, i) => {
            const src = photos[i];
            const busy = uploadingSlot === i;
            const content = src ? (
              <img src={src} alt={`Frame photo ${i + 1}`} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center gap-1 text-[0.6rem] text-muted-foreground">
                {busy ? (
                  <Loader2 className="size-4 animate-spin text-gold" />
                ) : (
                  <>
                    {onSlotClick && <ImagePlus className="size-4 text-gold" />}
                    <span>{onSlotClick ? `Add photo ${i + 1}` : `Photo ${i + 1}`}</span>
                  </>
                )}
              </div>
            );

            if (!onSlotClick) {
              return (
                <div key={i} className="overflow-hidden rounded-[2px] bg-secondary">
                  {content}
                </div>
              );
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSlotClick(i)}
                aria-label={src ? `Replace photo ${i + 1}` : `Upload photo ${i + 1}`}
                className="group relative overflow-hidden rounded-[2px] border border-dashed border-transparent bg-secondary transition-colors hover:border-primary"
              >
                {content}
                {src && (
                  <span className="absolute inset-0 hidden place-items-center bg-foreground/50 text-[0.6rem] text-background group-hover:grid">
                    Change
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
