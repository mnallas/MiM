import { Grid, Link, makeStyles, spacing, Typography } from "@material-ui/core";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../Context/UserContext";
import SearchBar from "../Components/SearchBar";
import Table from "../Components/Table/index";
import SearchContent from "../Components/SearchContent";
import Footer from "../Components/Footer"
import {Col, Row} from 'reactstrap';
import Finnhub from "../api/finnhub";
import Card from "../Components/Card";

const Home = () => {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const indices = ["S&P 500", "NASDAQ", "DIJA", "RUSSELL", "VIX"];

const [search, setSearch] = useState("");
// const [quote, setQuote] = useState([]);
const [error, setError] = useState();
const [result, setResult] = useState([]);
const [watchlist, setWatchlist] = useState([]);
const [rowInfo, setRowInfo] = useState([]);
let rows = [];

// grabs info about searched ticker ISSUE: pulls 5 cards
const getQuote = (e) =>{
  e.preventDefault();
  Finnhub.getData(search).then((res) => {
    console.log(res);
    setResult(res.data);
  });
}

const getTicker = (id) => {
 return Axios.get(`/users/find/${id}`, {
    headers: { "x-auth-token": localStorage.getItem("auth-token") },
  }); 
}

// Auto update watchlist under construction
const updateQuote = () => {
for (let i = 0; i < rows.length; i++) {
  Finnhub.getData(rows[i].symbol.then((res) =>{
   let updatedQuote = {
      ticker: res.data.financial.symbol,
      name: res.data.profile.name,
      last: res.data.quote.pc,
      high: res.data.quote.h,
      low: res.data.quote.l,
    }
    // await Axios.patch(
    //   `/users/edit/${res.data._id}`,
    //   updatedQuote,
    //   {
    //     headers: {
    //       "x-auth-token": localStorage.getItem(
    //         "auth-token"
    //       ),
    //     },
    //   }
    // );
    // renderWatchlist();
  }))
}
}

//renders watchlist
const renderWatchlist = async () => {
  await Axios.get("/users/renderWatchlist", {
    headers: { "x-auth-token": localStorage.getItem("auth-token") },
  }).then((res) => {
    setWatchlist(res.data);
    for (let i = 0; i < res.data.length; i++) {
      let item ={
          id: res.data[i]._id,
          symbol: res.data[i].ticker,
          name: res.data[i].name,
          last: res.data[i].last,
          high: res.data[i].high,
          low: res.data[i].low,
          vol: "n/a"
      }
      rows.push(item)
    }
    setRowInfo(rows);
  });
};

  useEffect(() => {
    if (!userData.user) history.push("/login");
    renderWatchlist();
    updateQuote();
    console.log(getTicker("5fe02946ef54851b9ae6d3cb"));
  }, [userData.user, history]);

  return (
    <>
    <Grid container spacing={2}>
      {/* Major Indices Cards */}
      <Grid container item sm={6} lg={6} spacing={2}>
        {indices.map((item,index) => {
          return (
            <Grid item sm={3}>
              <Card text={item}/>
            </Grid>
          )
        })}
      </Grid>
      {/* Stocks Search */}
      <Grid container item sm={10}>
        <SearchBar onChange={ (e)=>setSearch(e.target.value)} onClick={getQuote}/>
      </Grid>
        
      <Grid container item sm={6}>
        {Object.keys(result).map((item)=>{
          return (
            <Card>
              <p onClick={async () => {
                let saveTicker = {
                  ticker:result.financial.symbol,
                  name:result.profile.name,
                  last:result.quote.pc,
                  high:result.quote.h,
                  low:result.quote.l,
                };
                // adds ticker to watchlist
                await Axios.post("/users/addWatchlist", saveTicker, {
                  headers: { "x-auth-token": localStorage.getItem("auth-token") },
                });
                console.log("Added to watchlist");
                renderWatchlist();
              }}>Add to Watchlist</p>
              <SearchContent 
                ticker={result.financial.symbol}
                name={result.profile.name}
                open={result.quote.o}
                high={result.quote.h}
                // vol={}
                threeMonth={result.financial.metric["3MonthAverageTradingVolume"]}
                fwh={result.financial.metric["52WeekHigh"]}
                marketCap={result.financial.metric.marketCapitalization}
                // pefwd={}
                eps={result.financial.metric.epsBasicExclExtraItemsAnnual}
                // pturnover={}
                // sharesOut={}
                // ffmc={}
                // lotSize={}
                last={result.quote.pc}
                low={result.quote.l}
                turnover={result.financial.metric.inventoryTurnoverTTM}
                // range={}
                fwl={result.financial.metric["52WeekLow"]}
                // pettm={}
                dividend={result.financial.metric.dividendsPerShareTTM}
                divYield={result.financial.metric.dividendYieldIndicatedAnnual}
                pb={result.financial.metric.payoutRatioTTM}
                // freeFloat={}
                beta={result.financial.metric.beta}
                // edd={}
                />
            </Card>
          )
        })}
      </Grid>
      <Grid sm="6">
      <Table rows={rowInfo}/>
      </Grid>
      <Footer/>
    </Grid>
  </>
    );
};

export default Home;