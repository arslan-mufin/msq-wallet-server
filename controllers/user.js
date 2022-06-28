const Web3 = require('web3')
const ethers = require('ethers')
const User = require("../models/user")
const fs = require('fs')
const web3_config = require("../config/web3")
const UNISWAP = require("quickswap-sdk")
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent} = require("quickswap-sdk");
const provider = new ethers.providers.getDefaultProvider(
  "https://rpc-mumbai.maticvigil.com/",
);
const ROUTER_ADDRESS = "0x8954AfA98594b838bda56FE4C12a09D7739D179b"
const WETH_ADDRESS = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
const ROUTER_ABI = require("../contract_address/router_abi.json")
const WETH_ABI = require("../contract_address/weth_abi.json")
const ROUTER_CONTRACT = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider)
const WETH_CONTRACT = new ethers.Contract(WETH_ADDRESS, WETH_ABI, provider)

const get_req = async (req, res) => {
  res.status(200).send("success")
}
const get_users = async (req, res, next) => {
  //  address: '0xc03B8CC49b8B1A9ff694D3203C5d98f37eFC47F1',
  // privateKey: '0x54ab4dc409a087ead20eb45969e17177ebaa4c8c3b7251b1a6269c104f9003c9',
    
  // create wallet
  // const web3 = await web3_config()
    // const wallet = web3.eth.accounts.wallet.create(1)
    // Object.entries(wallet).forEach((entry) => {
    //   console.log({entry});
    // });
    const MP = new Token(
      UNISWAP.ChainId.MUMBAI,
      "0x6fFd66587d2aa6a629fAD7b00fD2847b7d79A989",
      18
  );

    console.log(WETH[MP.chainId])
    const resp = await swapTokens(MP, WETH[MP.chainId], 0.001)
    console.log(resp)
    res.json({message: "wallet"}); // dummy function for now
};

const create_user =  async (req, res, next) => {
    const {name, email, wallet} = req.body
    console.log(req.body)

    const user = new User({
      name,
      email,
      wallet
    });
    try {
        await user.save();
        res.status(200).send(user);
      } catch (error) {
        console.log(error)
        res.status(500).send({error: error});
      }
};

const update_user = async (req, res) =>{
  const {name, email} = req.body
  console.log(name,email)
  try {
    // update user by email
    const user = User.updateOne({email},{$set:{name}})
    // const users = User.findOne({email:"ayyanniazi82@gmail.com"})
    console.log(await user)
    // await user.save();
    res.status(200).send({message :"success"})
  } catch(err){
    console.log(err.message)
    res.status(500).send({err})
  }
}


module.exports = {
  get_users,
  create_user,
  update_user,
  get_req
};



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