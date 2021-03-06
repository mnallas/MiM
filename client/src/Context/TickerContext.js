import React, { useState,  useEffect } from "react";
import Finnhub from "../api/finnhub";
import Axios from "axios";


// this creates global state for ticker search bar
export const SearchContext = React.createContext({
    ticker: {
        value: "",
        onChange: () => {},
      },
});

export const Search = () => {
    const [ticker, setTicker] = useState();
    return {
        name: {
            value: ticker,
            onChange: (e) => setTicker(e.target.value),
          }
        } 
}

// this creates context for searchcontent component
export const TickerContext = React.createContext(); 

const objectResult = {
    watchList: [],
    news: [],
    rows: [],
}

export const Ticker = ({children}) => {
    const [state, setState] = useState(objectResult);
    useEffect(() => {
        renderWatchlist();
        console.log(state);
    }, [])
    return (
        <TickerContext.Provider value={[state,setState]}>{children}</TickerContext.Provider>
    )
}



const renderWatchlist = async () => {
    let newsPlaceholder =[];
    let placeHolder = [];
    let rowPlaceholder = [];
    await Axios.get("/users/renderWatchlist", {
      headers: { "x-auth-token": localStorage.getItem("auth-token") },
    }).then(async (res) => {
      objectResult.watchList = res.data;
       for (let i = 0; i < res.data.length; i++) {
        placeHolder.push(res.data[i].ticker)
        await Axios.get(`/users/news/${res.data[i].ticker}`)
        .then( (res) => {
            newsPlaceholder.push(res.data)
        })
        objectResult.news = newsPlaceholder;
      }
       for (let i = 0; i < placeHolder.length; i++) {
        await Finnhub.getData(placeHolder[i]).then((res) => {
          let item = {
            symbol: res.data.quote.symbol,
            name: res.data.quote.companyName,
            last: res.data.quote.latestPrice,
            high: res.data.quote.high,
            low:  res.data.quote.low,
            vol: res.data.quote.latestVolume,
          }
          rowPlaceholder.push(item);
        })
      }
      objectResult.rows = rowPlaceholder;
    });
  };



  //get news for Watchlist

//renders watchlist
// const renderWatchlist = async () => {
//   await Axios.get("/users/renderWatchlist", {
//     headers: { "x-auth-token": localStorage.getItem("auth-token") },
//   }).then(async (res) => {
//     setWatchlist(res.data);
//      for (let i = 0; i < res.data.length; i++) {
//       placeHolder.push(res.data[i].ticker)
//       await Axios.get(`/users/news/${res.data[i].ticker}`)
//       .then((res) => setNews(...news, res.data))
//     }
//      for (let i = 0; i < placeHolder.length; i++) {
//       await Finnhub.getData(placeHolder[i]).then((res) => {
//         let item = {
//           symbol: res.data.symbol,
//           name: res.data.companyName,
//           last: res.data.latestPrice,
//           high: res.data.high,
//           low:  res.data.low,
//           vol: res.data.latestVolume,
//         }
//         rows.push(item)
//       })
//     }
//     setRowInfo(rows);
//   });
// };