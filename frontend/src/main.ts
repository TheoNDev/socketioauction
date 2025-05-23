import { Auction } from "./data/auction";

let auctionsRows = document.getElementById(
  "auctionsRows"
) as HTMLTableSectionElement;

function getAuctions() {
  fetch("http://localhost:3000/api/auctions")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((auction: Auction) => {
        auctionsRows.appendChild(createAuctionRow(auction));
      });
    });
}

getAuctions();

function createAuctionRow(auction: Auction): HTMLTableRowElement {
  let row = document.createElement("tr");
  row.innerHTML = `
        <td>${auction.id}</td>
        <td>${auction.name}</td>
        <td><a href="/oneauction.html?room=${auction.id}" class="btn btn-primary">Bid</a></td>
    `;
  return row;
}
