import React, { useContext } from "react";
import { ethers } from "ethers";
import { TokenAddress, getContract,numberWithCommas,TokenName, dividendTokenName} from "../../utils/helpers";
import { abi as TokenAbi } from "../../utils/abi/TikiAbi";
import "./EarningsManager.css";
import { ImEnter } from "react-icons/im";
import { BsArrowRight } from "react-icons/bs";
import { BiCoinStack } from "react-icons/bi";
import {
  AiOutlineDollarCircle,
  AiOutlineLock,
  AiOutlineClockCircle,
} from "react-icons/ai";
import MiniBox from "./MiniBox";
import Theme from "../Theme/Theme";
import moment from "moment";

async function getMetamaskWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed!");
    return null;
  }
  let metamask
  try {
    metamask = new ethers.providers.Web3Provider(window.ethereum, 56);
  } catch (e) {
    console.log('wrong chain')
    return null
  }
  // Prompt user for account connections
  await metamask.send("eth_requestAccounts", []);
  return metamask.getSigner();
}



function EarningManager({
  address,
  walletBalance,
  tokenBalance,
  totalPaid,
  ethPrice,
  lastPayoutTime,
  payout
}) {
  // console.log(moment(1628868088*1000).fromNow());
  const theme = useContext(Theme);
  let background = theme.background;
  let text = theme.text;
  const AddressMessage = "Please enter your address above";

  const handleClick = async () => {
    const signer = await getMetamaskWallet();
    if (signer === null) return
    try {
      const tikiContract = getContract(TokenAddress, TokenAbi, signer);
      const tx = await tikiContract.claim();
      console.log(tx.hash);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.log(err.message);
      return;
    }
  };

  return (
    <section
      style={{ background: `${background}` }}
      className="earningsManager"
    >
      <h1 style={{ color: `${text}` }} className="title">
        {TokenName} Earnings Manager
      </h1>

      <div className="long_box flex-between">
        <div className="flex">
          <ImEnter className="inter_icon" />
          <p>
            <span className="address">
            {address? address : AddressMessage}
            </span>
            {address? ` | BNB In Your Wallet: ${numberWithCommas(walletBalance)} ($${parseFloat(walletBalance * ethPrice).toFixed(3)})`: ""}
          </p>
        </div>
        <a className="flex" href="/">
          {" "}
          Buy {TokenName}{" "}
          <span>
            <BsArrowRight />
          </span>{" "}
        </a>
      </div>

      <div className="boxes">
        <MiniBox
          icon={<BiCoinStack />}
          iconBg="#EF6461"
          title={`Your ${TokenName} Holdings`}
          value={`${numberWithCommas(tokenBalance)} ${TokenName}`}
        />

        <MiniBox
          icon={<AiOutlineDollarCircle />}
          iconBg="#01BAEF"
          title={`Total ${dividendTokenName} Paid`}
          value={`${numberWithCommas(totalPaid)} ${dividendTokenName} ~$${numberWithCommas(
            parseFloat(totalPaid * ethPrice).toFixed(2)
          )}`}
        />
        <MiniBox
          icon={<AiOutlineLock />}
          iconBg="#519872"
          title="Last Payout Time"
          value={
            lastPayoutTime !=="0" && lastPayoutTime !==0
              ? `${moment(lastPayoutTime * 1000).fromNow()}`
              : "Never"
          }
          // value = {lastPayoutTime?`~ ${moment(1628868088*1000).fromNow()}`:'Never'}
        />
        <MiniBox
          icon={<AiOutlineClockCircle />}
          iconBg="#FFCA06"
          title="Next Payout Loading"
        //   value="Processing | 0%"
          value={payout>0?`${parseFloat(payout).toFixed(4)} ${dividendTokenName}`:'Processing'}
        />
      </div>

      <div className="long_box long_box2" style={{background: `${payout > 0 ? '#FFCA06' : '#cca20ca1'}` , cursor:`${payout > 0 ? 'pointer' : 'no-drop'}`}} onClick={payout > 0 ? handleClick : null}>
        <center>Optional - Connect Wallet and Claim Manually NOW</center>
      </div>
    </section>
  );
}

export default EarningManager;
