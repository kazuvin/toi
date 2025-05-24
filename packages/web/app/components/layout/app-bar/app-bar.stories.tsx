import type { Meta, StoryObj } from "@storybook/react";
import AppBar from "./app-bar";
import { MemoryRouter } from "react-router-dom";

const meta = {
  title: "Layout/AppBar",
  component: AppBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomBackground: Story = {
  args: {
    className: "bg-muted",
  },
};
