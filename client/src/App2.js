import React, { Component } from "react";
import { TezosNodeWriter, TezosParameterFormat } from "conseiljs";
import "./App.css";
const conseiljs = require("conseiljs");

var tezosNode = "https://carthagenet.smartpy.io/",
  contractAddress = "KT1JgN5639sQJNrF6R6YgNsmYcSciB3RY4JC";

const keystore = {
  publicKey: 'edpku79WdzX7FR1vEXskpHCGTvFw919KCAZTYwNY8okV4pYFqFeEHZ',
  privateKey: 'edskRmg561yf6j6nQbPfjK47FeHD8xwTZfpHqptKCZTJM5RHYgBFsiqbQTfwe5mPjQFWKg8HNGAewn71dTusrPPXawTTnp9b2D',
  publicKeyHash: 'tz1RXSXhc1XtNb7o19TAnvX2ESKTvRFgcAR1',
  seed: '',
  storeType: conseiljs.StoreType.Fundraiser
};

// App component
class App extends Component {
  constructor() {
    super();
    this.state = {
      contract: contractAddress,
      wallet: keystore.publicKeyHash,
      address: "",
      amount: "",
      pay_amount: "",
      borrow_amount: "",
      duration: "",
      pay_index: "",
      lend_index: "",
      latest_Og: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.mintToken = this.mintToken.bind(this);
    this.paid = this.paid.bind(this);
    this.lend = this.lend.bind(this);
    this.borrowreq = this.borrowreq.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async mintToken() {
    console.log(this.state.address, this.state.amount);

    var amount = 1,
      fee = 100000,
      storage_limit = 1000,
      gas_limit = 200000,
      entry_point = undefined,
      parameters = `(Right (Left (Right (Pair "${this.state.address}" ${this.state.amount}))))`,
      derivation_path = "";

    const result = await TezosNodeWriter.sendContractInvocationOperation(
      tezosNode,
      keystore,
      contractAddress,
      amount,
      fee,
      derivation_path,
      storage_limit,
      gas_limit,
      entry_point,
      parameters,
      TezosParameterFormat.Michelson
    );

    this.setState({ latest_Og: result.operationGroupID });
    alert(
      `Injected operation ! \n Invocation Group ID : ${result.operationGroupID}`
    );
  }

  async borrowreq() {
    console.log(this.state.borrow_amount, this.state.duration);

    var amount = 1,
      fee = 100000,
      storage_limit = 1000,
      gas_limit = 200000,
      entry_point = undefined,
      parameters = `(Left (Left (Left (Pair "${this.state.borrow_amount}" ${this.state.duration}))))`,
      derivation_path = "";

    const result = await TezosNodeWriter.sendContractInvocationOperation(
      tezosNode,
      keystore,
      contractAddress,
      amount,
      fee,
      derivation_path,
      storage_limit,
      gas_limit,
      entry_point,
      parameters,
      TezosParameterFormat.Michelson
    );

    this.setState({ latest_Og: result.operationGroupID });
    alert(
      `Injected operation ! \n Invocation Group ID : ${result.operationGroupID}`
    );
  }

  async lend() {
    console.log(this.state.lend_index);

    var amount = 1,
      fee = 100000,
      storage_limit = 1000,
      gas_limit = 200000,
      entry_point = undefined,
      parameters = `(Right (Left (Right ${this.state.lend_index})))`,
      derivation_path = "";

    console.log(parameters);
    const result = await TezosNodeWriter.sendContractInvocationOperation(
      tezosNode,
      keystore,
      contractAddress,
      amount,
      fee,
      derivation_path,
      storage_limit,
      gas_limit,
      entry_point,
      parameters,
      TezosParameterFormat.Michelson
    );

    console.log(result.operationGroupID);
    this.setState({ latest_Og: result.operationGroupID });
    alert(
      `Injected operation ! \n Invocation Group ID : ${result.operationGroupID}`
    );
  }

  async paid() {
    console.log(this.state.pay_index, this.state.pay_amount);

    var amount = 1,
      fee = 100000,
      storage_limit = 1000,
      gas_limit = 200000,
      entry_point = undefined,
      parameters = `(Right (Right (Right (Left (Pair ${this.state.lend_index} ${this.state.pay_amount})))))`,
      derivation_path = "";

    console.log(parameters);
    const result = await TezosNodeWriter.sendContractInvocationOperation(
      tezosNode,
      keystore,
      contractAddress,
      amount,
      fee,
      derivation_path,
      storage_limit,
      gas_limit,
      entry_point,
      parameters,
      TezosParameterFormat.Michelson
    );

    console.log(result.operationGroupID);
    this.setState({ latest_Og: result.operationGroupID });
    alert(
      `Injected operation ! \n Invocation Group ID : ${result.operationGroupID}`
    );
  }



  render() {
    return (
      <div className="container">
        <h1 className="navbar navbar-expand-lg navbar-light bg-light">
          {" "}
          P2P Lending
        </h1>
        <br />
        <p>Contract Address Interacting with : {this.state.contract}</p>
        <br />
        <p>Wallet Address Detected : {this.state.wallet}</p>
        <p> Latest Operation Group ID : {this.state.latest_Og}</p>


        <h3>Mint Token</h3>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label className="sr-only" htmlFor="inlineFormInputGroup">
              Address
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Address</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                placeholder="tz1.*"
                value={this.state.address}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <label className="sr-only">Amount</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Token Count</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="amount"
                name="amount"
                placeholder="Number"
                value={this.state.amount}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.mintToken}
            >
              Mint
            </button>
          </div>
        </div>
        <br />

        <p> Tokens Minted : {this.state.address}</p>
        <p> Token Count : {this.state.amount}</p>



        <br />
        <h3>Borrow Money</h3>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label className="sr-only" htmlFor="inlineFormInputGroup">
              Amount
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Amount</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="amount"
                name="amount"
                placeholder="Number"
                value={this.state.borrow_amount}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <label className="sr-only">Duration of Loan</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Duration of Loan</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="duration"
                name="duration"
                placeholder="Number"
                value={this.state.duration}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.borrowreq}
            >
              Generate Request
            </button>
          </div>
        </div>
        <br />
        <p> Amount : {this.state.borrow_amount}</p>
        <p> Duration : {this.state.duration}</p>

        <br />



        <h3>Lend</h3>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label className="sr-only" htmlFor="inlineFormInputGroup">
              Spender
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text"> Loan Index</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="index"
                name="index"
                placeholder="Number"
                value={this.state.lend_index}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.lend}
            >
              Lend
            </button>
          </div>
        </div>
        <br />
        <p> Loan Index : {this.state.lend_index}</p>



        <br />
        <h3>Pay Back Loan</h3>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label className="sr-only" htmlFor="inlineFormInputGroup">
              Amount
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Index</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="index"
                name="index"
                placeholder="Number"
                value={this.state.paid_index}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <label className="sr-only">Amount To Pay</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Amount</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="amount"
                name="amount"
                placeholder="Number"
                value={this.state.paid_amount}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.paid}
            >
              Pay Loan
            </button>
          </div>
        </div>
        <br />
        <p> Loan Index : {this.state.paid_index}</p>
        <p> Amount : {this.state.paid_amount}</p>

        <br />

        <footer class="page-footer font-small blue pt-4">
          <div class="footer-copyright text-center py-3">
            P2P Lending : Madhav Aggarwal
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
