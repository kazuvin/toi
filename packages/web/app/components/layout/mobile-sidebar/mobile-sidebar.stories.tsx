import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import MobileSidebar from "./mobile-sidebar";

const meta: Meta<typeof MobileSidebar> = {
  title: "Layout/MobileSidebar",
  component: MobileSidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
};
