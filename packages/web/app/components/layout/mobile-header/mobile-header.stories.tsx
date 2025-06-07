import type { Meta, StoryObj } from "@storybook/react";
import MobileHeader from "./mobile-header";

const meta: Meta<typeof MobileHeader> = {
  title: "Layout/MobileHeader",
  component: MobileHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onMenuClick: () => console.log("Menu clicked"),
  },
};
