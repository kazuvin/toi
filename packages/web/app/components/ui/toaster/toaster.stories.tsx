import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./index";

const meta = {
  title: "UI/Toaster",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
