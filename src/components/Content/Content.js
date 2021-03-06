import React , {useContext} from 'react';
import './Content.css';
import EarningManager from '../EarningsManager/EarningsManager'
import Holders from '../Holders/Holders';
import Trading from '../Trading/Trading';
import Theme from '../Theme/Theme';

function Content({address , walletBalance , tokenBalance , totalPaid , totalDividendsDistributed ,ethPrice,lastPayoutTime,BNBRewardsfee,totalSupply,payout}) {
    const theme = useContext(Theme)
    let body = theme === 'dark' ? '#fff' : '#F9F9F9';
    return (
        <section style={{background:`${body}`}} className="content">
            <EarningManager
            address = {address}
            walletBalance = {walletBalance}
            tokenBalance = {tokenBalance}
            totalPaid = {totalPaid}
            ethPrice={ethPrice}
            lastPayoutTime={lastPayoutTime}
            payout={payout}
             />
            <Holders
            totalDividendsDistributed = {totalDividendsDistributed}
            ethPrice={ethPrice}
             />
            <Trading tokenBalance={tokenBalance} ethPrice={ethPrice} BNBRewardsfee={BNBRewardsfee} totalSupply={totalSupply}/>
        </section>
    )
}

export default Content
