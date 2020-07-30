import smartpy as sp

class Contract(sp.Contract):
  def __init__(self):
    self.init(administrator = sp.address('tz1hdQscorfqMzFqYxnrApuS5i6QSTuoAp3w'), balances = {}, loans = {}, noLoans = 0, totalSupply = 0)

  @sp.entry_point
  def borrowreq(self, params):
    sp.verify((self.data.balances[sp.sender].balance - params.qty) >= 0)
    self.data.noLoans += 1
    self.data.loans[self.data.noLoans] = sp.record(amount = params.qty, borrower = sp.sender, collateral = params.qty, duration = params.dur, lender = sp.sender, lent = False, paid = False, payback = (params.qty * 108) // 100, req = True, starttime = sp.timestamp(0))
    self.data.balances[self.data.administrator].balance += params.qty
    self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - params.qty)

  @sp.entry_point
  def defaultor(self, params):
    sp.verify(sp.sender == self.data.administrator)
    sp.verify(self.data.loans[params].duration > (sp.timestamp(1596102766) - self.data.loans[params].starttime))
    sp.verify(self.data.loans[params].lent == True)
    self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - self.data.loans[params].collateral)
    self.data.balances[self.data.loans[params].lender].balance += self.data.loans[params].collateral

  @sp.entry_point
  def getAdministrator(self, params):
    sp.transfer(self.data.administrator, sp.tez(0), sp.contract(sp.TAddress, params.contractAddress, entry_point='viewAdministrator').open_some())

  @sp.entry_point
  def getBalance(self, params):
    sp.transfer(self.data.balances[params.arg.owner].balance, sp.tez(0), sp.contract(sp.TNat, params.contractAddress, entry_point='viewBalance').open_some())

  @sp.entry_point
  def getLoans(self, params):
    sp.transfer(self.data.noLoans, sp.tez(0), sp.contract(sp.TNat, params.contractAddress, entry_point='viewLoans').open_some())

  @sp.entry_point
  def getTotalSupply(self, params):
    sp.transfer(self.data.totalSupply, sp.tez(0), sp.contract(sp.TNat, params.contractAddress, entry_point='viewTotalSupply').open_some())

  @sp.entry_point
  def lend(self, params):
    sp.verify(self.data.loans[params].amount >= self.data.balances[sp.sender].balance)
    sp.verify(self.data.loans[params].req == True)
    self.data.loans[params].lent = True
    self.data.loans[params].lender = sp.sender
    self.data.balances[self.data.loans[params].borrower].balance += self.data.loans[params].amount
    self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - self.data.loans[params].amount)
    self.data.loans[params].starttime = sp.timestamp(1596102766)

  @sp.entry_point
  def mint(self, params):
    sp.set_type(params, sp.TRecord(address = sp.TAddress, value = sp.TNat).layout(("address", "value")))
    sp.verify(sp.sender == self.data.administrator)
    sp.if ~ (self.data.balances.contains(params.address)):
      self.data.balances[params.address] = sp.record(balance = 0)
    self.data.balances[params.address].balance += params.value
    self.data.totalSupply += params.value

  @sp.entry_point
  def paid(self, params):
    sp.verify(self.data.loans[params.index].borrower == sp.sender)
    sp.verify(params.amount >= self.data.loans[params.index].payback)
    sp.verify(self.data.loans[params.index].duration >= (sp.timestamp(1596102766) - self.data.loans[params.index].starttime))
    sp.verify(self.data.loans[params.index].lent == True)
    self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - self.data.loans[params.index].payback)
    self.data.balances[sp.sender].balance += self.data.loans[params.index].collateral
    self.data.balances[self.data.administrator].balance = sp.as_nat(self.data.balances[self.data.administrator].balance - self.data.loans[params.index].collateral)
    self.data.balances[self.data.loans[params.index].lender].balance += self.data.loans[params.index].payback

  @sp.entry_point
  def setAdministrator(self, params):
    sp.set_type(params, sp.TAddress)
    sp.verify(sp.sender == self.data.administrator)
    self.data.administrator = params