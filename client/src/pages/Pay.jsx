import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { contractAddress } from "../constants/contract";
import getThanos from "../util/thanos";

export default function LoanPay(props) {
  const [index, setIndex] = useState("");
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

  const Pay = async () => {
    const operation = await instance.methods
      .paid(index,deposit)
      .send();
    await operation.confirmation();
    setIndex("");
    setDeposit("");
    alert(`Injected operation group id ${operation.operationGroupID}`);
  };


  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Pay Back Loan
      </Typography>
      <div className="form-container">
        <TextField
          id="standard-basic"
          label="Enter Loan Index"
          className="text-field-key"
          onChange={(e) => setIndex(e.target.value)}
          value={index}
        />
        <br />
        <TextField
          id="standard-basic"
          label="Amount to Pay"
          className="text-field-key"
          onChange={(e) => setDeposit(e.target.value)}
          value={deposit}
        />
        <br />
        <Button
          onClick={() => Pay()}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
        >
          Pay Back Loan
        </Button>
      </div>
    </div>
  );
}