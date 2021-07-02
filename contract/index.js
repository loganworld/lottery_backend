const {lotteryContract,ticketContract,coinContract} =require('./contracts');
const {ethers} = require("ethers");

const testnet = `https://kovan.infura.io/v3/0c5409f01bb944168d3bb4b03a674f15`;
const provider = new ethers.providers.JsonRpcProvider(testnet);
const LotteryContract = new ethers.Contract(lotteryContract.kovan,lotteryContract.abi,provider);
const TicketContract = new ethers.Contract(ticketContract.kovan,ticketContract.abi,provider);
const CoinContract = new ethers.Contract(coinContract.kovan,coinContract.abi,provider);

// Admin Wallet
const adminaccount = {
    publicKey:"",
    privateKey:""
}
const adminWallet = new ethers.Wallet(adminaccount.privateKey, provider);

const testAddress = "0x760e0302e71A84B7a6247ee921A3e1Cbf500f65D";
//lottery contract with signer

const SignedLotteryContract =LotteryContract.connect(adminWallet);
const SignedCoinContract = CoinContract.connect(adminWallet);

const drawCall = async () => {
    var tx =await SignedLotteryContract.drawing("11")
        .catch((err) => {
        console.log("contract err",err)
    });
    console.log(tx.hash);
    console.log(await tx.wait());
 };

 const parseCall = async () => {
    var tx =await SignedLotteryContract.enterDrawingPhase()
        .catch((err) => {
        console.log("contract err",err)
    });
    console.log(tx.hash);
    console.log(await tx.wait());
 };

 const resetCall = async () => {
    var tx =await SignedLotteryContract.reset()
        .catch((err) => {
        console.log("contract err",err)
    });
    console.log(tx.hash);
    console.log(await tx.wait());
 };
 const InitializeCall = async () => {
    var tx =await SignedLotteryContract.initialize(CoinContract.address,TicketContract.address,ethers.utils.parseUnits("10",coinContract.decimals),"20",adminWallet.address,adminWallet.address)
        .catch((err) => {
        console.log("contract err",err)
    });
    console.log(tx.hash);
    console.log(await tx.wait());
 };
 module.exports = {SignedLotteryContract,TicketContract,SignedCoinContract,drawCall,parseCall,InitializeCall,resetCall};
