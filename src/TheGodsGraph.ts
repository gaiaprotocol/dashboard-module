import { DomNode, Theme, ThemeManager } from "@common-module/app";
import { SupabaseConnector } from "@common-module/supabase";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeries,
  Time,
} from "lightweight-charts";

const supabaseConnector = new SupabaseConnector(
  "https://dhzxulywizygtdficytt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenh1bHl3aXp5Z3RkZmljeXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTIxNDUsImV4cCI6MjA0NTY4ODE0NX0.xUd8nqcT2aVn1j4x8c-pRbDcFSaIGtkn7SAcmKleBms",
);

export default class TheGodsGraph extends DomNode {
  private chart: IChartApi;
  private lineSeries: ISeriesApi<"Line">;
  private _metric: "numOwners" | "floorPrice" = "numOwners";
  private stats: { time: string; floor_price: number; num_owners: number }[] =
    [];

  constructor(metric: "numOwners" | "floorPrice") {
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

  private renderChart() {
    const chartData: LineData<Time>[] = this.stats.map<LineData<Time>>((
      stat,
    ) => ({
      time: new Date(stat.time).getTime() / 1000 as Time,
      value: this._metric === "floorPrice" ? stat.floor_price : stat.num_owners,
    }));
    this.lineSeries.setData(chartData);
    this.chart.timeScale().fitContent();
  }

  private async fetchData() {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const isoDate = sixtyDaysAgo.toISOString();

    this.stats = await supabaseConnector.safeFetch<{
      time: string;
      floor_price: number;
      num_owners: number;
    }>(
      "gods_stats",
      (b) =>
        b.select("*").order("time", { ascending: true }).gte("time", isoDate),
    );

    this.renderChart();
  }

  public set metric(metric: "numOwners" | "floorPrice") {
    this._metric = metric;
    this.renderChart();
  }

  public get metric() {
    return this._metric;
  }
}
