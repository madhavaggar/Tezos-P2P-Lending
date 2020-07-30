import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import getThanos from "../util/thanos";
import { contractAddress } from "../constants/contract";

export default function LoanBorrow(props) {
  const [deposit, setDeposit] = useState(0);
  const [duration, setDuration] = useState(0);
  const [instance, setInstance] = useState("");

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const tezos = await getThanos();
    const instance = await tezos.wallet.at(contractAddress);
    setInstance(instance);
    console.log(instance);
  };

  const Borrow = async () => {
    const operation = await instance.methods
      .borrowreq(deposit, duration)
      .send();
    await operation.confirmation();
    setDeposit(0);
    setDuration(0);
  };

  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Borrow Amount
      </Typography>
      <div className="form-container">
        <TextField
          id="standard-basic"
          label="Enter Amount Needed"
          className="text-field-key"
          onChange={(e) => setDeposit(e.target.value)}
          value={deposit}
        />
        <br />
        <TextField
          id="standard-basic"
          label="Duration"
          className="text-field-key"
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
        />
        <br />
        <Button
          onClick={() => Borrow()}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
        >
          Borrow Tokens
        </Button>
      </div>
    </div>
  );
}