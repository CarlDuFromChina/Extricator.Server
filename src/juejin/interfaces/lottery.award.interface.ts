
export interface Award {
  count: number,
  lotteries: Array<AwardLottery>
}

export interface AwardLottery {
  date: number,
  dip_lucky_user_count: number,
  dip_lucky_users: Array<any>,
  history_id: string,
  lottery_image: string,
  lottery_name: string,
  user_avatar: string,
  user_id: string,
  user_name: string
}