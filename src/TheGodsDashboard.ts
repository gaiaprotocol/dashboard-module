import { DomNode, el } from "@common-module/app";

export default class TheGodsDashboard extends DomNode {
  constructor() {
    super(".the-gods-dashboard");
    this.append(
      el("h2", "Global Stats"),
      el("h2", "Top God collectors"),
    );
    this.fetchCollectionStats();
  }

  private async fetchCollectionStats() {
    const response = await fetch(
      "https://dhzxulywizygtdficytt.supabase.co/functions/v1/get-gods-stats",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenh1bHl3aXp5Z3RkZmljeXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTIxNDUsImV4cCI6MjA0NTY4ODE0NX0.xUd8nqcT2aVn1j4x8c-pRbDcFSaIGtkn7SAcmKleBms",
        },
      },
    );
    const data = await response.json();
    console.log(data);
  }
}
