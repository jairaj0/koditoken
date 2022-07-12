import React, { useContext, useState, useEffect } from "react";
import Theme from "../Theme/Theme";
import "./trading.css";
import { calculate, numberWithCommas,TokenName, dividendTokenName} from "../../utils/helpers";

function Trading({ tokenBalance, ethPrice, BNBRewardsfee, totalSupply }) {
  const theme = useContext(Theme);
  const background = theme.background;
  const color = theme.border;
  const text = theme.sText;
  const title = theme.text;
  const [tradingVolume, setTradingVolume] = useState(0);
  const [perDayBnb, setPerDayBnb] = useState(0);

  useEffect(() => {
    if (tradingVolume !== 0) {
      setPerDayBnb(
        calculate(
          BNBRewardsfee,
          parseInt(tradingVolume),
          ethPrice,
          parseInt(tokenBalance),
          totalSupply
        )
      );
      // console.log((predayBnb*ethPrice).toFixed(1));
      // console.log(((predayBnb*ethPrice)*7).toFixed(1));
      // console.log(((predayBnb*ethPrice)*30).toFixed(1));
      // console.log(((predayBnb*ethPrice)*365).toFixed(1));
    }
  }, [tradingVolume, tokenBalance, ethPrice, BNBRewardsfee, totalSupply]);

  const handleChange = (event) => setTradingVolume(event.target.value);


  return (
    <section className="trading">
      <h1 className="info">
        Estimations are based on a default of the last 24h of trading volume
        Change the volume to predict earnings based on other volume figures
      </h1>

      <div className="TradingVolumeFunc flex">
        <h1>Trading Volume = </h1>
        <div>
        <span>$</span>
        <input
        style={{background:`${background}` , color:`${color}`}}
          type="number"
          placeholder="10,000"
          className="tradingVolume"
          onChange={handleChange}
        />
        </div>
      </div>

      <section className="earns flex-around">
        <section
          style={{ background: `${background}` }}
          className="kodi_box flex-center"
        >
          <div>
            <h2 style={{ color: `${title}` }} className="earns_heading flex">
              Your {numberWithCommas(tokenBalance)} {TokenName} Earns
            </h2>
            <h4>
              <span className="bnb">
                {!Number.isNaN(perDayBnb) ? perDayBnb.toFixed(2) : "0.00"}
              </span>
              <span className="bnb">{dividendTokenName}</span>
              <span className="dollar">
                ($
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * ethPrice).toFixed(2)
                  : "0.00"}
                )
              </span>
              <span style={{ color: `${text}` }} className="time">
                Per day
              </span>
            </h4>
            <h4>
              <span className="bnb">
                {!Number.isNaN(perDayBnb) ? (perDayBnb * 7).toFixed(2) : "0.00"}
              </span>
              <span className="bnb">{dividendTokenName}</span>
              <span className="dollar">
                ($
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * ethPrice * 7).toFixed(2)
                  : "0.00"}
                )
              </span>
              <span style={{ color: `${text}` }} className="time">
                Per week
              </span>
            </h4>
            <h4>
              <span className="bnb">
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * 30).toFixed(2)
                  : "0.00"}
              </span>
              <span className="bnb">{dividendTokenName}</span>
              <span className="dollar">
                ($
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * ethPrice * 30).toFixed(2)
                  : "0.00"}
                )
              </span>
              <span style={{ color: `${text}` }} className="time">
                Per month
              </span>
            </h4>
            <h4>
              <span className="bnb">
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * 365).toFixed(2)
                  : "0.00"}
              </span>
              <span className="bnb">{dividendTokenName}</span>
              <span className="dollar">
                ($
                {!Number.isNaN(perDayBnb)
                  ? (perDayBnb * ethPrice * 365).toFixed(2)
                  : "0.00"}
                )
              </span>
              <span style={{ color: `${text}` }} className="time">
                Per year
              </span>
            </h4>

            <h5 style={{ color: `${text}` }}>
              Estimations are based on ${numberWithCommas(tradingVolume)}{" "}
              trading volume
            </h5>
          </div>
        </section>

        {/* <section
          style={{ background: `${background}` }}
          className="kodi_box flex-center"
        >
          <div>
            <h2 style={{ color: `${title}` }} className="earns_heading">
              By Reinvesting Dividends Every Day, Your{" "}
              {numberWithCommas(tokenBalance)} KODI Becomes:
            </h2>
            <h4>
              <span className="bnb">0</span>
              <span className="bnb">KODI</span>
              <span className="dollar">(0x Earnings)</span>
              <span style={{ color: `${text}` }} className="time">
                weekly
              </span>
            </h4>
            <h4>
              <span className="bnb">0</span>
              <span className="bnb">KODI</span>
              <span className="dollar">(0x Earnings)</span>
              <span style={{ color: `${text}` }} className="time">
                Monthly
              </span>
            </h4>
            <h4>
              <span className="bnb">0</span>
              <span className="bnb">KODI</span>
              <span className="dollar">(0x Earnings)</span>
              <span style={{ color: `${text}` }} className="time">
                2 months
              </span>
            </h4>
            <h4>
              <span className="bnb">0</span>
              <span className="bnb">KODI</span>
              <span className="dollar">(0x Earnings)</span>
              <span style={{ color: `${text}` }} className="time">
                In 6 months
              </span>
            </h4>

            <h5 style={{ color: `${text}` }}>
              Estimations are based on current $KODI price
            </h5>
          </div>
        </section> */}
      </section>
    </section>
  );
}

export default Trading;
