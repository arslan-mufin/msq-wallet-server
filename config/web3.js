const Web3 = require('web3')
async function web3_config(){
    // new Promise(async (resolve, reject) => {
        const provider = new Web3.providers.HttpProvider(
            // "http://127.0.0.1:8545"
            "https://rpc-mumbai.maticvigil.com/",
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          return web3
          //   resolve(web3);
        // Modern dapp browsers...
        // if (window.ethereum) {
        //   const web3 = new Web3(window.ethereum);
        //   try {
        //     // Request account access if needed
        //     await window.ethereum.enable();
        //     // Accounts now exposed
        //     resolve(web3);
        //   } catch (error) {
        //     reject(error);
        //   }
        // }
        // // Legacy dapp browsers...
        // else if (window.web3) {
        //   // Use Mist/MetaMask's provider.
        //   const web3 = window.web3;
        //   console.log("Injected web3 detected.");
        //   resolve(web3);
        //   // Fallback to localhost; use dev console port by default...
        // } else {
        //   const provider = new Web3.providers.HttpProvider(
        //     // "http://127.0.0.1:8545"
        //     "https://data-seed-prebsc-1-s1.binance.org:8545/",
        //   );
        //   const web3 = new Web3(provider);
        //   console.log("No web3 instance injected, using Local web3.");
        //   resolve(web3);
        // }
    //   });
}

module.exports = web3_config