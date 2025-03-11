import { Socket, io } from "socket.io-client";
import { Auction } from "./data/auction";

// // SMARTASTE ROOMHANTERINGEN
const currentRoom = new URLSearchParams(document.location.search).get("room");
const socket: Socket = io("http://localhost:3000", {
  query: {
    roomName: currentRoom,
  },
});

socket.on("connect", () => {
  displayBid();
});

socket.on("joined", (room: string) => {
  console.log("Joined room:", room);
});

socket.on("newBid", () => {
  displayBid();
});

async function setBid(bid: number, bidder: string) {
  if (!bid) {
    alert("Please enter a bid");
    return;
  }
  if (!bidder) {
    alert("Please enter your name");
    return;
  }

  const data = await getAuction();
  if (!data) return;
  if (bid <= (data.currentBid ?? data.minprice)) {
    alert("Please enter a bid higher than the current bid");
    return;
  }

  socket.emit("placeBid", {
    id: data.id,
    name: data.name,
    minprice: data.minprice,
    currentBid: bid,
    highestBidder: bidder,
  });
}

const bidForm = document.getElementById("bidForm");
if (bidForm) {
  const bidInput = document.getElementById("bidInput") as HTMLInputElement;
  const bidderInput = document.getElementById(
    "bidderInput"
  ) as HTMLInputElement;
  bidForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setBid(bidInput.valueAsNumber, bidderInput.value);
    bidInput.value = "";
    bidderInput.value = "";
  });
}

async function getAuction(): Promise<Auction> {
  return fetch("http://localhost:3000/api/auctions/" + currentRoom)
    .then((response) => response.json())
    .then((data: Auction) => {
      return data;
    });
}

async function displayBid() {
  const data = await getAuction();
  if (!data) {
    alert("Auction not found");
    return;
  }

  const auctionTitleElement = document.getElementById("auction_title");
  if (auctionTitleElement) {
    auctionTitleElement.innerText = data.name;
  }
  const auctionBidElement = document.getElementById("bid");
  if (auctionBidElement) {
    auctionBidElement.innerText =
      data.currentBid !== undefined
        ? data.currentBid.toString()
        : data.minprice?.toString() ?? "No bids yet";
  }
  const auctionBidderElement = document.getElementById("bidder");
  if (auctionBidderElement) {
    if (data.highestBidder === undefined) {
      auctionBidderElement.innerText = "No bids yet";
    } else {
      auctionBidderElement.innerText = data.highestBidder;
    }
  }
}
