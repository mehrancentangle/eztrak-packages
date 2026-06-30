import { useState } from "react";
import Tippy from "@tippyjs/react";
import type { TippyProps } from "@tippyjs/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { cn } from "../../utils/cn";
import type { PopupCellRendererProps } from "./types";

/**
 * Interactive popup trigger for table row actions (e.g. AG Grid cell renderer).
 *
 * Import Tippy styles in your app once:
 * `import "tippy.js/dist/tippy.css"`
 * `import "tippy.js/themes/light.css"`
 */
export function PopupCellRenderer<TRow = unknown>({
  dropDownContent,
  actionIcon: ActionIcon = BiDotsVerticalRounded,
  title = "Actions",
  className,
  hideTitle = false,
  params,
  onAction,
  placement = "bottom-end",
  tippyProps,
}: PopupCellRendererProps<TRow>) {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const rowData = params?.data;

  const handleAction = (actionType: string, actionRowData?: TRow) => {
    onAction?.(actionType, actionRowData ?? rowData, hide);
    hide();
  };

  const content: TippyProps["content"] =
    typeof dropDownContent === "function"
      ? dropDownContent(handleAction)
      : dropDownContent;

  return (
    <div className="flex h-full">
      <Tippy
        content={content}
        visible={visible}
        onClickOutside={hide}
        allowHTML
        arrow={false}
        appendTo={() => document.body}
        interactive
        placement={placement}
        animation="shift-away"
        theme="light"
        maxWidth="none"
        offset={[0, 5]}
        {...tippyProps}
      >
        <button
          type="button"
          onClick={visible ? hide : show}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full text-gray-500 hover:text-gray-800",
            className,
          )}
          aria-label="Row actions"
        >
          {!hideTitle && title}
          <ActionIcon aria-hidden />
        </button>
      </Tippy>
    </div>
  );
}
