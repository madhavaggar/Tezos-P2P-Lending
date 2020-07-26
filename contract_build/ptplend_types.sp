Storage: sp.TRecord(administrator = sp.TAddress, balances = sp.TBigMap(sp.TAddress, sp.TRecord(balance = sp.TNat).layout("balance")), loans = sp.TMap(sp.TNat, sp.TRecord(amount = sp.TNat, borrower = sp.TAddress, collateral = sp.TNat, duration = sp.TInt, lender = sp.TAddress, lent = sp.TBool, paid = sp.TBool, payback = sp.TNat, req = sp.TBool, starttime = sp.TTimestamp).layout(((("amount", "borrower"), ("collateral", ("duration", "lender"))), (("lent", "paid"), ("payback", ("req", "starttime")))))), noLoans = sp.TNat, totalSupply = sp.TNat).layout((("administrator", "balances"), ("loans", ("noLoans", "totalSupply"))))
Params: sp.TVariant(borrowreq = sp.TRecord(dur = sp.TInt, qty = sp.TNat).layout(("dur", "qty")), defaultor = sp.TNat, getAdministrator = sp.TRecord(contractAddress = sp.TAddress).layout("contractAddress"), getBalance = sp.TRecord(arg = sp.TRecord(owner = sp.TAddress).layout("owner"), contractAddress = sp.TAddress).layout(("arg", "contractAddress")), getLoans = sp.TRecord(contractAddress = sp.TAddress).layout("contractAddress"), getTotalSupply = sp.TRecord(contractAddress = sp.TAddress).layout("contractAddress"), lend = sp.TNat, mint = sp.TRecord(address = sp.TAddress, value = sp.TNat).layout(("address", "value")), paid = sp.TRecord(amount = sp.TNat, index = sp.TNat).layout(("amount", "index")), setAdministrator = sp.TAddress).layout(((("borrowreq", "defaultor"), ("getAdministrator", ("getBalance", "getLoans"))), (("getTotalSupply", "lend"), ("mint", ("paid", "setAdministrator")))))