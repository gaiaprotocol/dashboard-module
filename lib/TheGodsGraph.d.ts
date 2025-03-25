import { DomNode } from "@common-module/app";
export default class TheGodsGraph extends DomNode {
    private chart;
    private lineSeries;
    private _metric;
    private stats;
    constructor(metric: "numOwners" | "floorPrice");
    private renderChart;
    private fetchData;
    set metric(metric: "numOwners" | "floorPrice");
    get metric(): "numOwners" | "floorPrice";
}
//# sourceMappingURL=TheGodsGraph.d.ts.map