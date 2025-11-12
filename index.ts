import { RelayClient } from "@polymarket/builder-relayer-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { ClobClient } from "@polymarket/clob-client";
import { WSSubscriptionManager, type PolymarketPriceUpdateEvent } from "@nevuamarkets/poly-websockets"
import { ethers } from "ethers";
import { WebSocket } from "ws";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";

const builderConfig = new BuilderConfig({
	remoteBuilderConfig: { url: "http://localhost:42069/sign" }
});

const relayerHost = "https://relayer-v2.polymarket.com"
const wallet = createWalletClient({
	chain: polygon,
	transport: http(polygon.rpcUrls.default.http[0])
});

const client = new RelayClient(relayerHost, polygon.id, wallet, builderConfig);

const walletTransactions = await client.getTransactions()
console.log(walletTransactions)

const host = 'https://clob.polymarket.com';
const clobClient = new ClobClient(host, polygon.id, ethers.Wallet.createRandom());
const resp = await clobClient.createOrDeriveApiKey();
// // NOTE: https://docs.polymarket.com/quickstart/websocket/WSS-Quickstart
// // https://docs.polymarket.com/developers/CLOB/websocket/market-channel

const socket = new WebSocket('wss://ws-subscriptions-clob.polymarket.com/ws/market');

socket.on("open", () => {
	socket.send(JSON.stringify({
		auth: resp,
		assets_ids: ["67709783846070480898866904372843480455952555401443797796248411029439279129088"],
		type: "market"
	}));
});

socket.on("message", (data) => {
	const parsed = JSON.parse(data.toString());
	console.log(parsed);
});

