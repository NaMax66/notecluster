const API_BASE = import.meta.env.VITE_CLOUDFLARE_BASE_API;

type NoteCluster = {
  title: string;
  description: string;
  note_numbers: number[];
};

type AnalyzeOk = { success: true; clusters: NoteCluster[] };
type AnalyzeValidationError = {
  success: false;
  errors: unknown;
  result: Record<string, never>;
};

export async function analyzeNotes(
  notes: string,
  language: string
): Promise<NoteCluster[]> {
  const res = await fetch(`${API_BASE}/api/notes/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include", // только если реально шлёте куки; иначе уберите
    body: JSON.stringify({ notes, language }),
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }

  const ok = data as AnalyzeOk | AnalyzeValidationError;
  if (!ok.success) {
    throw new Error("Validation failed");
  }

  return ok.clusters;
}
