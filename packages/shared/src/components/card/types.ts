import type { ReactNode } from "react";

export interface CardProps {
  title: string;
  content?: string | null;
  icon: ReactNode;
  onClick?: () => void;
  containerClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  cardBodyClassName?: string;
}
