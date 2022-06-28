const axios = require("axios");
const { Transaction } = require('@ethereumjs/tx')
const {CustomChain} = require('@ethereumjs/common')
const fs = require('fs')
const UNISWAP = require("quickswap-sdk")
// const {CustomChain } = require("@ethereumjs/common")
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const web3_config = require("../config/web3")

async function transfer_fund(sendersData, recieverData, amountToSend) {
    return new Promise(async (resolve, reject) => {
const web3 = await web3_config()
        
        var nonce = await web3.eth.getTransactionCount(sendersData.address);
        web3.eth.getBalance(sendersData.address, async (err, result) => {
            if (err) {
                return reject();
            }
            let balance = web3.utils.fromWei(result, "ether");
            console.log(balance + " ETH");
            if (balance < amountToSend) {
                console.log('insufficient funds');
                return reject();
            }

            let gasPrices = await getCurrentGasPrices();
            let details = {
                "to": recieverData.address,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": gasPrices.low * 1000000000,
                "nonce": nonce,
                "chainId": 80001 // EIP 155 chainId - mainnet: 1, rinkeby: 4
            };

            const transaction = new EthereumTx(details, { chain: 'mumbai' });
            let privateKey = sendersData.privateKey.split('0x');
            let privKey = Buffer.from(privateKey[1], 'hex');
            transaction.sign(privKey);

            const serializedTransaction = transaction.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
                if (err) {
                    console.log(err);
                    return reject();
                }
                const url = `https://rinkeby.etherscan.io/tx/${id}`;
                console.log(url);
                resolve({ id: id, link: url });
            });
        });
    });
}

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    };
    return prices;
}

async function getBalance(address) {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, async (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(web3.utils.fromWei(result, "ether"));
        });
    });
}

async function send_coin(req, res) {
    try {
        const privateKey = '0x54ab4dc409a087ead20eb45969e17177ebaa4c8c3b7251b1a6269c104f9003c9'
        const rpcurl = "https://rpc-mumbai.maticvigil.com/"
        const provider = new Provider(privateKey, rpcurl);
        const web3 = new Web3(provider);
        const resp = new web3.eth.sendTransaction({from:'0xc03B8CC49b8B1A9ff694D3203C5d98f37eFC47F1', to:'0xd2E0AbEDF7edc31554f34c1AdB36A482f67A387a', value: web3.utils.toWei('0.05', "ether"), gas:21000});
        console.log(resp)
        // transfer_fund(
        //     { address: '0xc03B8CC49b8B1A9ff694D3203C5d98f37eFC47F1', privateKey: '0x54ab4dc409a087ead20eb45969e17177ebaa4c8c3b7251b1a6269c104f9003c9' },
        //     { address: '0xd2E0AbEDF7edc31554f34c1AdB36A482f67A387a' }, 
        //     0.01)
        res.status(200).send({message: "success"})
    }catch(err){
        console.log(err.message)
        res.status(500).send({err})
    }
}

async function swapExactETHForTokens(req, res) {
    try{
    const MP = new Token(
        UNISWAP.ChainId.MUMBAI,
        "0x6fFd66587d2aa6a629fAD7b00fD2847b7d79A989", // custom token 
        18
    );
  
      const resp = await swapTokens(MP, WETH[MP.chainId], 0.001)
      console.log(resp)
      res.status(200).send({message: "success"}); // dummy function for now
    } catch(err) {
        res.status(500).send({message: "server error"})
    }
}

async function swapTokens(token1, token2, amount, slippage = "50") {

    try {
        const wallet = new ethers.Wallet("71290a342cc96d86dff7e4bb244895a7cca3fff4e9830e87f0411d2213e1ee41", provider)
        const pair = await Fetcher.fetchPairData(token1, token2, provider); //creating instances of a pair
        const route = await new Route([pair], token2); // a fully specified path from input token to output token
        let amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei
        amountIn = amountIn.toString()
        
        const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
    
        const trade = new Trade( //information necessary to create a swap transaction.
                route,
                new TokenAmount(token2, amountIn),
                TradeType.EXACT_INPUT
        );
  
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        const path = [token2.address, token1.address]; //An array of token addresses
        const to = wallet.address; // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string
    
        //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
        const rawTxn = await ROUTER_CONTRACT.populateTransaction.swapExactETHForTokens(amountOutMinHex, path, to, deadline, {
            value: valueHex
        })
    
        //Returns a Promise which resolves to the transaction.
        let sendTxn = (await wallet).sendTransaction(rawTxn)
        
  
        //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
        let reciept = (await sendTxn).wait()
  
        //Logs the information about the transaction it has been mined.
        if (reciept) {
            console.log(" - Transaction is mined - " + '\n' 
            + "Transaction Hash:", (await sendTxn).hash
            + '\n' + "Block Number: " 
            + (await reciept).blockNumber + '\n' 
            + "Navigate to https://rinkeby.etherscan.io/txn/" 
            + (await sendTxn).hash, "to see your transaction")
        } else {
            console.log("Error submitting transaction")
        }
  
    } catch(e) {
        console.log(e)
    }
  }

module.exports = {
    send_coin,
    swapExactETHForTokens
}