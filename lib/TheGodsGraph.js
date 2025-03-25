import { DomNode, Theme, ThemeManager } from "@common-module/app";
import { SupabaseConnector } from "@common-module/supabase";
import { createChart, LineSeries, } from "lightweight-charts";
const supabaseConnector = new SupabaseConnector("https://dhzxulywizygtdficytt.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenh1bHl3aXp5Z3RkZmljeXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTIxNDUsImV4cCI6MjA0NTY4ODE0NX0.xUd8nqcT2aVn1j4x8c-pRbDcFSaIGtkn7SAcmKleBms");
export default class TheGodsGraph extends DomNode {
    chart;
    lineSeries;
    _metric = "numOwners";
    stats = [];
    constructor(metric) {
        super(".the-gods-graph");
        this.chart = createChart(this.htmlElement, {
            autoSize: true,
            height: 350,
            layout: {
                background: {
                    color: ThemeManager.getShowingTheme() === Theme.Dark
                        ? "rgba(36, 39, 47)"
                        : "rgba(231, 224, 236)",
                },
                textColor: ThemeManager.getShowingTheme() === Theme.Dark
                    ? "rgba(230, 230, 230, 0.5)"
                    : "rgba(73, 69, 79, 0.5)",
            },
            grid: {
                vertLines: {
                    color: ThemeManager.getShowingTheme() === Theme.Dark
                        ? "rgba(230, 230, 230, 0.1)"
                        : "rgba(73, 69, 79, 0.1)",
                },
                horzLines: {
                    color: ThemeManager.getShowingTheme() === Theme.Dark
                        ? "rgba(230, 230, 230, 0.1)"
                        : "rgba(73, 69, 79, 0.1)",
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });
        this.lineSeries = this.chart.addSeries(LineSeries, { color: "#2962FF" });
        this.metric = metric;
        this.fetchData();
    }
    renderChart() {
        const chartData = this.stats.map((stat) => ({
            time: new Date(stat.time).getTime() / 1000,
            value: this._metric === "floorPrice" ? stat.floor_price : stat.num_owners,
        }));
        this.lineSeries.setData(chartData);
        this.chart.timeScale().fitContent();
    }
    async fetchData() {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const isoDate = sixtyDaysAgo.toISOString();
        this.stats = await supabaseConnector.safeFetch("gods_stats", (b) => b.select("*").order("time", { ascending: true }).gte("time", isoDate));
        this.renderChart();
    }
    set metric(metric) {
        this._metric = metric;
        this.renderChart();
    }
    get metric() {
        return this._metric;
    }
}
//# sourceMappingURL=TheGodsGraph.js.map