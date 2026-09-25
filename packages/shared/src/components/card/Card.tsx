import { cn } from "../../utils/cn";
import type { CardProps } from "./types";

export function Card({
  title,
  content,
  icon,
  onClick,
  containerClassName = "shadow p-6",
  iconClassName = "",
  titleClassName = "",
  contentClassName = "",
  cardBodyClassName = "",
}: CardProps) {
  return (
    <div
      className={cn(
        "transform transition duration-300 cursor-pointer select-none",
        containerClassName
      )}
      onClick={onClick}
    >
      <div className={cn("flex space-x-4", cardBodyClassName)}>
        <span className={cn("text-primary text-3xl", iconClassName)}>{icon}</span>
        <div>
          <h3 className={cn("font-semibold text-lg text-primary", titleClassName)}>
            {title}
          </h3>
          {content != null && (
            <p className={cn("text-sm text-secondary", contentClassName)}>{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
