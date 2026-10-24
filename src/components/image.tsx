import type { CSSProperties, ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Ocupa todo el contenedor (que debe tener position relative/absolute). */
  fill?: boolean;
  /** Imagen principal de la página: se carga de inmediato. */
  priority?: boolean;
  quality?: number;
};

const fillStyle: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };

// Reemplazo sencillo de next/image con la misma forma de uso.
export default function Image({ fill, priority, quality: _quality, style, ...props }: ImageProps) {
  return (
    <img
      {...props}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={fill ? { ...fillStyle, ...style } : style}
    />
  );
}
