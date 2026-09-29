import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, type ReactNode } from "react";
import { HiCalendar } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../components/breadcrumbs";

const TRAIL = "/events/1q27-crude-coker/coker-ta27/budget";

const customTitles = {
  events: "Events",
  "1q27-crude-coker": "1Q27 Crude & Coker",
  "coker-ta27": "Coker TA27",
  budget: "Budget",
};

function AtTrail({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const didSetTrail = useRef(location.pathname === TRAIL);

  useEffect(() => {
    if (didSetTrail.current || location.pathname === TRAIL) {
      didSetTrail.current = true;
      return;
    }
    didSetTrail.current = true;
    navigate(TRAIL, { replace: true });
  }, [location.pathname, navigate]);

  if (!didSetTrail.current) {
    return null;
  }

  return children;
}

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AtTrail>
        <div className="w-full">
          <Story />
        </div>
      </AtTrail>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Screenshot: Story = {
  args: {
    customTitles,
  },
};

export const CustomColorsAndIcon: Story = {
  args: {
    customTitles,
    customIcons: {
      events: <HiCalendar aria-hidden size={14} />,
    },
    backgroundColor: "#EEF2FF",
    inactiveColor: "#4338CA",
    activeColor: "#1E1B4B",
    separatorColor: "#A5B4FC",
    iconColor: "#4338CA",
  },
};
