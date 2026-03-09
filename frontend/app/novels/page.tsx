import { redirect } from "next/navigation";

// /novels redirects to / (homepage is now the Reading page)
export default function NovelsRedirect() {
    redirect("/");
}
