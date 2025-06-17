import { type MetaFunction } from "@remix-run/node";
import { PrivacyPolicy } from "~/features/legal/components/privacy-policy";

export const meta: MetaFunction = () => {
  return [
    { title: "プライバシーポリシー - Toi" },
    { name: "description", content: "Toiのプライバシーポリシーです" },
  ];
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <PrivacyPolicy />
    </div>
  );
}