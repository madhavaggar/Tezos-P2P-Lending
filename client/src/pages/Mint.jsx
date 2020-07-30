import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import getThanos from "../util/thanos";
import { contractAddress } from "../constants/contract";

export default function TokenMint(props) {
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [instance, setInstance] = useState("");

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const tezos = await getThanos();
    const instance = await tezos.wallet.at(contractAddress);
    setInstance(instance);
  };

  const Mint = async () => {
    const operation = await instance.methods
      .mint(address,deposit)
      .send();
    await operation.confirmation();
    setAddress("");
    setDeposit(0);
    alert(`Injected operation group id ${operation.operationGroupID}`);
  };

  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Mint
      </Typography>
      <div className="form-container">
        <TextField
          id="standard-basic"
          label="Enter Address to Mint for"
          className="text-field-key"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <br />
        <TextField
          id="standard-basic"
          label="Mint Amount"
          className="text-field-key"
          onChange={(e) => setDeposit(e.target.value)}
          value={deposit}
        />
        <br />
        <Button
          onClick={() => Mint()}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
        >
          Mint Tokens
        </Button>
      </div>
    </div>
  );
}