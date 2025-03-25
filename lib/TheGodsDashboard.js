import { DomNode, el } from "@common-module/app";
import { AppCompConfig, Tab, TabGroup } from "@common-module/app-components";
import TheGodsGraph from "./TheGodsGraph.js";
export default class TheGodsDashboard extends DomNode {
    statsContent;
    graphTabGroup;
    graph;
    constructor() {
        super(".the-gods-dashboard");
        this.append(el("section.stats", el("h2", "Global Stats"), this.statsContent = el(".content")), el("section.graph", this.graphTabGroup = new TabGroup(new Tab({ label: "Holders", value: "numOwners" }), new Tab({ label: "Floor Price", value: "floorPrice" })), this.graph = new TheGodsGraph("numOwners")), el("section", el("h2", "Top God collectors")));
        this.graphTabGroup.on("tabSelected", (value) => this.graph.metric = value);
        this.fetchCollectionStats();
        this.on("visible", () => this.graphTabGroup.init());
    }
    async fetchCollectionStats() {
        this.statsContent.append(new AppCompConfig.LoadingSpinner());
        const response = await fetch("https://dhzxulywizygtdficytt.supabase.co/functions/v1/get-gods-stats", {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenh1bHl3aXp5Z3RkZmljeXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTIxNDUsImV4cCI6MjA0NTY4ODE0NX0.xUd8nqcT2aVn1j4x8c-pRbDcFSaIGtkn7SAcmKleBms",
            },
        });
        const data = await response.json();
        this.statsContent.clear().append(el(".stat", el(".value", String(data.total.num_owners)), el(".label", "Total unique holders")), el(".stat", el(".value", String(data.total.floor_price), " ", data.total.floor_price_symbol), el(".label", "Floor price")));
    }
}
//# sourceMappingURL=TheGodsDashboard.js.map