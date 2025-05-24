import type { Meta, StoryObj } from "@storybook/react";
import { MoodBoard } from "./index";

const meta: Meta<typeof MoodBoard> = {
  title: "Design/MoodBoard",
  component: MoodBoard,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof MoodBoard>;

export const Default: Story = {};
