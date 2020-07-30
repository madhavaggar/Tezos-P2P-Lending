import smartpy as sp

class Contract(sp.Contract):
  def __init__(self):
    self.init()

  @sp.entry_point
  def viewAdministrator(self, params):
    sp.set_type(params, sp.TAddress)

  @sp.entry_point
  def viewBalance(self, params):
    sp.set_type(params, sp.TNat)

  @sp.entry_point
  def viewLoans(self, params):
    sp.set_type(params, sp.TNat)

  @sp.entry_point
  def viewTotalSupply(self, params):
    sp.set_type(params, sp.TNat)