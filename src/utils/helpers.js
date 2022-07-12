import { ethers } from "ethers";

export const TokenAddress='0x9b76D1B12Ff738c113200EB043350022EBf12Ff0'
export const TokenName='COPDOGE'
export const dividendTokenName='BUSD'

export const getContract=(TokenAddress,TokenAbi,provider)=>new ethers.Contract(TokenAddress, TokenAbi, provider);

export const getWalletBalance =async(provider,walletAddress)=>{
    let balance=await provider.getBalance(walletAddress)
    return ethers.utils.formatEther(balance)
}

export const init =()=>{
    const rpcUrl='https://bsc-dataseed1.defibit.io/'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    return provider
}

export const getEthersPrice =async()=>{
    let url = `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true`;
    let response = await fetch(url);
    let data = await response.json();
    return data.binancecoin;
}

export const numberWithCommas=(x)=> {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// fun

export const BNBRewardsFee=async(tikiContract)=>{
   let fee= await tikiContract.BNBRewardsFee();
   return parseInt(ethers.utils.formatUnits(fee, 0))
}

export const getTotalSupply=async(tikiContract,tikiDecimal)=>{
    let totalsupply=await tikiContract.totalSupply();
    return parseInt(ethers.utils.formatUnits(totalsupply, tikiDecimal));
}

export const getTotalDividendsDistributed=async(tikiContract)=>{
    let x=await tikiContract.getTotalDividendsDistributed();
    return parseFloat(ethers.utils.formatEther(x)).toFixed(0)
}

export const balanceOf=async(Contract,userAddress,decimal)=>{
    let tokenBalance = await Contract.balanceOf(userAddress);
    return parseFloat(ethers.utils.formatUnits(tokenBalance, decimal)).toFixed(0)
}


function getTotalDailyReward(rewardfee,tradingVolume,priceOfBnb){
    return ((rewardfee/100)*tradingVolume)/priceOfBnb;
}

export const calculate=(rewardfee,tradingVolume,priceOfBnb,userBalance,tokenTotalSupply)=>{
    let totalDailyReward=getTotalDailyReward(rewardfee,tradingVolume,priceOfBnb);
    let usersDailyRewardInBnb=(userBalance/tokenTotalSupply)*totalDailyReward;
    return usersDailyRewardInBnb;
}



// from tiki

// const pcsRouterContract = new ethers.Contract(pcsRouter.address, pcsRouter.abi, provider)

let pcsRouterContract;

const bnb = {
    address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    decimals: 18,
  }
const busd = {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    decimals: 18,
}

export const getBnbPrice=async()=> {
    const functionResponse = await getAmountsOut(`${1 * Math.pow(10, bnb.decimals)}`, [bnb.address, busd.address])
    const priceInUsd = Number(functionResponse.amounts[1].toString()) / Math.pow(10, busd.decimals)
    console.log('bnb', priceInUsd)
    // return priceInUsd
}

export const getTikiPrice=async(tikiDecimals=18,tikiContractAddress=TokenAddress)=> {
    const functionResponse = await getAmountsOut(`${1 * Math.pow(10, tikiDecimals)}`, [tikiContractAddress, bnb.address, busd.address])
    const priceInUsd = Number(functionResponse.amounts[2].toString()) / Math.pow(10, busd.decimals)
    console.log('tiki', priceInUsd)
    // return priceInUsd
}

export const getPcsRouterContract=(contract)=>{
    pcsRouterContract=contract;
}
async function getAmountsOut(quoteAmount, path) {
    return await pcsRouterContract.functions['getAmountsOut'](
      quoteAmount,
      path,
      { gasLimit: 1000000000000 }
    )
}