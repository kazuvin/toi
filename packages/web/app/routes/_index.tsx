import { redirect } from "@remix-run/react";

export async function clientLoader() {
  return redirect("/new");
}

export default function Index() {
  return null;
}
