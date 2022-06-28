const axios = require("axios");
const { Transaction } = require('@ethereumjs/tx')
const {CustomChain} = require('@ethereumjs/common')
// const {CustomChain } = require("@ethereumjs/common")
const web3_config = require("../config/web3")
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");

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
    
}

module.exports = {
    send_coin
}