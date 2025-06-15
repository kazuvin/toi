import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import { Label } from "../label";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" {...args} />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
  args: {
    defaultChecked: false,
  },
};

export const LearningSettings: Story = {
  render: (args) => (
    <div className="space-y-4 w-64">
      <div className="flex items-center justify-between">
        <Label htmlFor="shuffle" className="flex items-center space-x-2 cursor-pointer">
          <span className="text-sm font-normal">シャッフル</span>
        </Label>
        <Switch id="shuffle" {...args} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="thorough" className="flex items-center space-x-2 cursor-pointer">
          <span className="text-sm font-normal">徹底学習</span>
        </Label>
        <Switch id="thorough" defaultChecked={true} />
      </div>
    </div>
  ),
  args: {
    defaultChecked: false,
  },
};