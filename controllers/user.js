const Web3 = require('web3')
const ethers = require('ethers')
const User = require("../models/user")
const fs = require('fs')
const web3_config = require("../config/web3")
const UNISWAP = require("quickswap-sdk")
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require("quickswap-sdk");
const provider = new ethers.providers.getDefaultProvider(
  "https://rpc-mumbai.maticvigil.com/",
);
const ROUTER_ADDRESS = "0x8954AfA98594b838bda56FE4C12a09D7739D179b"
const WETH_ADDRESS = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
const ROUTER_ABI = require("../contract_address/router_abi.json")
const WETH_ABI = require("../contract_address/weth_abi.json")
const { getSystemErrorName } = require('util')
const ROUTER_CONTRACT = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider)
const WETH_CONTRACT = new ethers.Contract(WETH_ADDRESS, WETH_ABI, provider)

const get_req = async (req, res) => {
  res.status(200).send("success")
}
const get_user = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    user = {
      wallet: user?.wallet?.address,
      email: user?.email,
      name: user?.name,
      id: user?.id,
    }
    console.log(user)
    res.status(200).send(user)
  } catch (err) {
    res.status(500).send({ msg: "server error" })
  }
};


const create_user = async (req, res, next) => {
  const { name, email } = req.body
  try {
    const wallet = await createWallet()
    console.log(wallet)
    const user = new User({
      name,
      email,
      wallet
    });
    await user.save();
    res.status(200).send({ name, email, wallet: wallet.address });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "server error" });
  }
};

const update_user = async (req, res) => {
  const { name, email } = req.body
  console.log(name, email)
  try {
    // update user by email
    const user = User.updateOne({ email }, { $set: { name } })
    // const users = User.findOne({email:"ayyanniazi82@gmail.com"})
    console.log(await user)
    // await user.save();
    res.status(200).send({ message: "success" })
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ err })
  }
}

const createWallet = async () => {

  const web3 = await web3_config()
  const wallet = web3.eth.accounts.wallet.create(1)
  let arr = []
  Object.entries(wallet).forEach((entry) => {
    if (arr.length < 1 && entry.length > 1) {
      arr.push({ address: entry[1]?.address, privateKey: entry[1]?.privateKey })
    }
  });
  return arr[0]
};
module.exports = {
  get_user,
  create_user,
  update_user,
  get_req
};



