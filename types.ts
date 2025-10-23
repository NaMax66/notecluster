
export interface Cluster {
  title: string;
  description: string;
  note_numbers: number[];
}

export interface GeminiResponse {
  clusters: Cluster[];
}
