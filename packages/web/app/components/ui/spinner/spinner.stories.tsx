import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
    variant: "default",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    variant: "default",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "default",
  },
};

export const Primary: Story = {
  args: {
    size: "md",
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    size: "md",
    variant: "accent",
  },
};
