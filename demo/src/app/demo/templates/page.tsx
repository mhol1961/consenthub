import { FileText, Plus, Eye, Clock } from "lucide-react";
import templates from "@/data/templates.json";

export const metadata = {
  title: "Templates — ConsentHub Demo",
};

const regulationColors: Record<string, string> = {
  hipaa: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  gdpr: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  tcpa: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
};

const consentTypeLabels: Record<string, string> = {
  marketing_email: "Marketing Email",
  treatment: "Treatment",
  data_sharing: "Data Sharing",
  research: "Research",
  marketing_sms: "Marketing SMS",
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage consent form templates for your organization
        </p>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-950/50"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                <FileText className="h-5 w-5 text-teal" />
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  regulationColors[template.regulation_type] ||
                  "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                {template.regulation_type.toUpperCase()}
              </span>
            </div>

            <h3 className="mb-1 font-serif text-lg text-navy">
              {template.name}
            </h3>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              {consentTypeLabels[template.consent_type] ||
                template.consent_type}{" "}
              &middot; Version {template.version}
            </p>

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {template.plain_language_summary}
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {template.expiration_days
                  ? `${template.expiration_days} days`
                  : "No expiration"}
              </div>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-teal transition-colors hover:text-teal/80"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
