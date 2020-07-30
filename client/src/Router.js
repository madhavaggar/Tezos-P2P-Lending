import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen.jsx";
import TokenMint from "./pages/Mint.jsx";
import LoanLend from "./pages/Lend.jsx";
import LoanPay from "./pages/Pay.jsx";
import LoanBorrow from "./pages/Borrow.jsx";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/home" exact>
        <HomeScreen />
      </Route>
      <Route path="/lend" exact>
        <LoanLend />
      </Route>
      <Route path="/pay" exact>
        <LoanPay />
      </Route>
      <Route path="/mint" exact>
        <TokenMint />
      </Route>
      <Route path="/borrow" exact>
        <LoanBorrow />
      </Route>
      <Route exact path="" render={() => <Redirect to="/home" />} />
    </Switch>
  </BrowserRouter>
);

export default Router;