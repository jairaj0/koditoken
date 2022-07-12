import React, { useState , useEffect } from "react";
import Content from "./components/Content/Content";
import Sidebar from "./components/Sidebar/Sidebar";
import Theme, { themes } from "./components/Theme/Theme";
import { IoSettingsOutline } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "./Img/copdoge.jpg";
import "./Universal/Universal.css";
import "./components/Nav/nav.css";
import Footer from "./components/Footer/Footer";
import { ethers } from "ethers";
import {getContract,getWalletBalance,init,TokenAddress,getEthersPrice,BNBRewardsFee,getTotalSupply,TokenName,getTotalDividendsDistributed,balanceOf} from './utils/helpers';
import {abi as TokenAbi} from './utils/abi/TikiAbi';
import pcsRouter from './utils/psRouter'
import {getBnbPrice,getTikiPrice,getPcsRouterContract} from './utils/helpers'

function App() {
  const [menubar, setMenubar] = useState(false)
  const [theme, setTheme] = useState(themes.dark);
  const [address, setAddress] = useState(localStorage.getItem('address') || '')
  const [provider, setProvider] = useState(init())
  const [walletBalance, setWalletBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [payout, setPayout] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalDividendsDistributed, setTotalDividendsDistributed] = useState(0)
  const [ethPrice, setEthPrice] = useState(0)
  const [lastPayoutTime, setLastPayoutTime] = useState(0)
  const [BNBRewardsfee, setBNBRewardsfee] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)

  // const pcsRouterContract = new ethers.Contract(pcsRouter.address, pcsRouter.abi, provider)
  // getPcsRouterContract(pcsRouterContract)
  // getBnbPrice()
  // getTikiPrice()


  useEffect(() => {  
    if(address!==""){
      const changeInfo=async()=>{
        try{
          ethers.utils.getAddress(address);
          localStorage.setItem('address', address)
        }catch(err){
          return
        }
        let BNBBalance = await getWalletBalance(provider,address)
        setWalletBalance(parseFloat(BNBBalance).toFixed(4));
        const tikiContract = getContract(TokenAddress, TokenAbi, provider);
        let tikiDecimal = await tikiContract.decimals()

        // token balance
        // let tokenBalance = await tikiContract.balanceOf(address);
        // setTokenBalance(parseFloat(ethers.utils.formatUnits(tokenBalance, tikiDecimal)).toFixed(0))
        let tokenBalance = await balanceOf(tikiContract,address,tikiDecimal)
        setTokenBalance(tokenBalance)
        
        // upcoming dividends rewards
        let comingDividends=await tikiContract.withdrawableDividendOf(address)
        setPayout(ethers.utils.formatUnits(comingDividends, tikiDecimal))
        
        //can remove below
        // console.log('upcoming dividends rewards',ethers.utils.formatUnits(comingDividends, tikiDecimal));
    
        // total paid
        let AccountDividendsInfo=await tikiContract.getAccountDividendsInfo(address)
        setTotalPaid(
          parseFloat(ethers.utils.formatEther(AccountDividendsInfo[4])-ethers.utils.formatEther(AccountDividendsInfo[3])).toFixed(4) 
        )
        
        //can remove below
        // let totalBNBPaid=ethers.utils.formatEther(AccountDividendsInfo[4])-ethers.utils.formatEther(AccountDividendsInfo[3])
        // console.log('Total BNB Paid',totalBNBPaid.toFixed(4));
    
        // getTotalDividendsDistributed
        let x= await getTotalDividendsDistributed(tikiContract);
        setTotalDividendsDistributed(x)
        
        // etherum price
        let {usd}=await getEthersPrice()
        setEthPrice(usd);

        setLastPayoutTime(ethers.utils.formatUnits(AccountDividendsInfo[5], 0))

        let bnbRewardsFee=await BNBRewardsFee(tikiContract);
        setBNBRewardsfee(bnbRewardsFee)

        let totalsupply=await getTotalSupply(tikiContract,tikiDecimal)
        setTotalSupply(totalsupply)
      }
      changeInfo();
    }
  }, [address,provider])



  const handleChange = (event) => setAddress(event.target.value);

  //Menubar
  const MenuBar =() =>  menubar ? setMenubar(false) : setMenubar(true);
  const toggleTheme = () => theme === themes.dark ? setTheme(themes.light) : setTheme(themes.dark);
  let background = theme.background;
  let text = theme.text;
  let border = theme.border
  return (
    <Theme.Provider value={theme}>
      {/* Nav Part  */}
      <nav style={{background: `${background}`}}>
        <div className="container flex-between">
          <div className="logo flex">
            <img src={logo} alt="logo" className="logo_img" />
            <div className="logo_text">
              {TokenName}
            </div>
          </div>
          <GiHamburgerMenu onClick={MenuBar} style={{ color: `${text}` }} className="menu" />
          

          <div style={{borderColor: `${border}`}} className="address_box flex">
            <FiFileText style={{ color: `${text}`}} className="copy_icon" />
            <input
              style={{ color: `${text}`}}
              placeholder="Paste address here"
              value={address!==''?address:''}
              onChange={handleChange}
              type="text"
            />
          </div>

          <div style={{ color: `${text}` }} className="setting">
            <IoSettingsOutline onClick={toggleTheme} />
          </div>
        </div>
      </nav>
      {/* Nav Part  */}
      <Sidebar
      menubar = {menubar}
       />
      <Content
      address = {address}
      walletBalance = {walletBalance}
      tokenBalance = {tokenBalance}
      totalPaid = {totalPaid}
      totalDividendsDistributed = {totalDividendsDistributed}
      ethPrice={ethPrice}
      lastPayoutTime={lastPayoutTime}
      payout={payout}
      BNBRewardsfee={BNBRewardsfee}
      totalSupply={totalSupply}
        />
      <Footer />
    </Theme.Provider>
  );
}

export default App;
