export class Auction {
  constructor(
    public id: string,
    public name: string,
    public minprice: number,
    public currentBid: number,
    public highestBidder: string
  ) {}
}
