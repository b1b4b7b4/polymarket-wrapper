import { RelayClient } from "@polymarket/builder-relayer-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { ClobClient } from "@polymarket/clob-client";
import { WSSubscriptionManager, type PolymarketPriceUpdateEvent } from "@nevuamarkets/poly-websockets"
import { ethers } from "ethers";
import { WebSocket } from "ws";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";

// const builderConfig = new BuilderConfig({
// 	remoteBuilderConfig: { url: "http://localhost:42069/sign" }
// });
//
// const relayerHost = "https://relayer-v2.polymarket.com"
// const wallet = createWalletClient({
// 	chain: polygon,
// 	transport: http(polygon.rpcUrls.default.http[0])
// });
//
// const client = new RelayClient(relayerHost, polygon.id, wallet, builderConfig);
//
// const walletTransactions = await client.getTransactions()
// console.log(walletTransactions)


// wss
const host = 'https://clob.polymarket.com';
const clobClient = new ClobClient(host, polygon.id, ethers.Wallet.createRandom());
const resp = await clobClient.createOrDeriveApiKey();

const markets = await clobClient.getMarkets()
console.dir(markets, { depth: null })
const randomTokens = markets.data[0].tokens.map((x: any) => x.token_id)

// const socket = new WebSocket('wss://ws-subscriptions-clob.polymarket.com/ws/market')
/// * `api_key` - Your API key
/// * `api_secret` - Your API secret
/// * `passphrase` - Your API passphrase
/// * `asset_ids` - List of token IDs to subscribe to

// const randomTokens = markets.data[0].tokens.map((x: any) => x.token_id)

// const tokens = []
// for (let market of markets.data) {
// 	tokens.push(...market.tokens.map((x: any) => x.token_id))
// }

// const stream = new WSSubscriptionManager({
// 	onLastTradePrice: async e => console.log(e),
// 	onPolymarketPriceUpdate: async e => console.log(e),
// 	onTickSizeChange: async e => console.log(e),
// 	onWSClose: async e => console.log(e),
// 	onWSOpen: async e => console.log(e),
// 	onPriceChange: async e => console.log(e),
// 	onBook: async e => console.log(e),
// 	onError: async e => console.log(e),
// });
//
// await stream.addSubscriptions(randomTokens);

// NOTE: https://docs.polymarket.com/quickstart/websocket/WSS-Quickstart
// https://docs.polymarket.com/developers/CLOB/websocket/market-channel

const MARKET_CHANNEL = "market"
const USER_CHANNEL = "user"
const socket = new WebSocket('wss://ws-subscriptions-clob.polymarket.com/ws/' + MARKET_CHANNEL);

socket.on("open", () => {
	socket.send(JSON.stringify({
		// auth: {
		// 	"apiKey": resp.key, "secret": resp.secret, "passphrase": resp.passphrase
		// },
		assets_ids: randomTokens,
		// markets: [],
		type: MARKET_CHANNEL
	}));
});

socket.on("message", (data) => {
	const parsed = JSON.parse(data.toString());
	console.log(parsed);
});
