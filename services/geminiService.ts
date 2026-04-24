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
type ApiErrorResponse = {
  success?: boolean;
  code?: string;
  message?: string;
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

  const rawBody = await res.text();
  let data: unknown = null;

  if (rawBody.trim()) {
    try {
      data = JSON.parse(rawBody) as unknown;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const parsedError =
      typeof data === "object" && data !== null ? (data as ApiErrorResponse) : null;
    const apiCode = parsedError?.code;
    const apiMessage =
      typeof parsedError?.message === "string" ? parsedError.message.trim() : "";

    if (res.status === 503 && apiCode === "GEMINI_HIGH_DEMAND") {
      throw new Error("The service is overloaded now. Please try again later.");
    }

    throw new Error(
      apiMessage || rawBody.trim() || res.statusText || `HTTP ${res.status}`
    );
  }

  const ok = data as AnalyzeOk | AnalyzeValidationError;
  if (!ok.success) {
    throw new Error("Validation failed");
  }

  return ok.clusters;
}
