import Link from "next/link";
import { QuestionFlow } from "@/components/QuestionFlow";

export default function DiagnosticPage() {
  return (
    <main className="form-shell">
      <div className="grid-background" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>
        <QuestionFlow />
      </div>
    </main>
  );
}
