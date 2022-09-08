import { Lottery } from "./lottery.interface";

export interface LotteryConfigData {
  free_count: number,
  lottery: Array<Lottery>,
  point_cost: number
}
