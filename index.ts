import { RelayClient } from "@polymarket/builder-relayer-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { ClobClient } from "@polymarket/clob-client";
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
console.log(markets)
const randomTokens = markets.data[0].tokens.map((x: any) => x.token_id)

const socket = new WebSocket('wss://ws-subscriptions-clob.polymarket.com/ws/market')
/// * `api_key` - Your API key
/// * `api_secret` - Your API secret
/// * `passphrase` - Your API passphrase
/// * `asset_ids` - List of token IDs to subscribe to

socket.on("open", () => {
	console.log("open")

	socket.send(JSON.stringify({
		auth: {
			api_key: resp.key,
			secret: resp.secret,
			passphrase: resp.secret,
		},
		assets_ids: randomTokens,
	}))
})
socket.on("message", (x) => {
	console.log(JSON.parse(x.toString()))
})
setInterval(() => {
	socket.ping()
}, 10_000)
