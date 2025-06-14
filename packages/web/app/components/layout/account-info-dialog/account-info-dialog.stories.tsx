import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import AccountInfoDialog from "./account-info-dialog";

const meta: Meta<typeof AccountInfoDialog> = {
  title: "Layout/AccountInfoDialog",
  component: AccountInfoDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccountInfoDialog>;

function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        アカウント情報を開く
      </Button>
      <AccountInfoDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DialogDemo />,
};