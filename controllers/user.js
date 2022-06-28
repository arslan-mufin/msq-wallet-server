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



