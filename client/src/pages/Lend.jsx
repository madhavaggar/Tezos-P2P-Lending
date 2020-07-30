import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import getThanos from "../util/thanos";
import { contractAddress } from "../constants/contract";

export default function LoanLend(props) {
  const [index, setIndex] = useState("");
  const [instance, setInstance] = useState("");

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const tezos = await getThanos();
    const instance = await tezos.wallet.at(contractAddress);
    setInstance(instance);
  };

  const Lend = async () => {
    const operation = await instance.methods.lend(index).send();
    await operation.confirmation();
    setIndex("");
    alert(`Injected operation group id ${operation.operationGroupID}`);
  };

  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Lend
      </Typography>
      <div className="form-container">
        <TextField
          id="standard-basic"
          label="Enter Loan Index"
          className="text-field-key"
          onChange={(e) => setIndex(e.target.value)}
          value={index}
        />
        <Button
          onClick={() => Lend()}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
        >
          Lend Tokens
        </Button>
      </div>
    </div>
  );
}