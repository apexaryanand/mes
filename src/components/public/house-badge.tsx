import { HOUSE_COLOR_HEX, type House, type HouseColor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function houseColorHex(color: HouseColor | null | undefined): string {
  if (!color) return HOUSE_COLOR_HEX.blue;
  return HOUSE_COLOR_HEX[color];
}

export function HouseBadge({
  house,
  className,
}: {
  house: Pick<House, "color" | "short_name" | "name_en">;
  className?: string;
}) {
  const hex = houseColorHex(house.color);
  const label = house.short_name ?? house.name_en;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold text-white shadow-sm",
        className,
      )}
      style={{
        backgroundColor: hex,
        borderColor: hex,
      }}
    >
      <span className="h-2 w-2 rounded-full bg-white/90" aria-hidden />
      {label}
    </span>
  );
}
