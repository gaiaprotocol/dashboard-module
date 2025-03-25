import { DomNode } from "@common-module/app";

export default class TheGodsGraph extends DomNode {
  constructor(
    period: "24h" | "7d" | "14d" | "30d" | "60d",
    metric: "floorPrice" | "numOwners",
  ) {
    super(".the-gods-graph");
  }
}
