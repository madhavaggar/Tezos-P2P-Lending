import smartpy as sp

class P2PLend(sp.Contract):
    def __init__(self, admin):
        self.init(
            loans = sp.map(
                tkey = sp.TNat,
                tvalue = sp.TRecord(
                    borrower = sp.TAddress,
                    lender = sp.TAddress,
                    amount = sp.TNat,
                    starttime = sp.TTimestamp,
                    duration = sp.TInt,
                    payback = sp.TNat,
                    req = sp.TBool,
                    lent = sp.TBool,
                    paid = sp.TBool,
                    collateral = sp.TNat
                ) 
            ),
            administrator = admin,
            balances = sp.big_map(
                tvalue = sp.TRecord(
                    balance = sp.TNat
                )
            ),
            noLoans = 0,
            totalSupply = 0
        )

    @sp.entry_point
    def borrowreq(self, qty, dur):
        sp.verify(self.data.balances[sp.sender].balance - qty >= 0)
        loan = sp.record(
            borrower = sp.sender,
            lender = sp.sender,
            amount = qty,
            starttime = sp.timestamp(0),
            duration = dur,
            payback = (qty*108)/100 ,
            req = True,
            lent = False,
            paid = False,
            collateral = qty
        )
        self.data.noLoans += 1
        self.data.loans[self.data.noLoans] = loan
        self.data.balances[self.data.administrator].balance += qty
        self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - qty)

    @sp.entry_point
    def lend(self, index):
        loan = self.data.loans[index]
        sp.verify(loan.amount >= self.data.balances[sp.sender].balance)
        sp.verify(loan.req == True)
        self.data.loans[index].lent = True
        self.data.loans[index].lender = sp.sender
        self.data.balances[loan.borrower].balance += loan.amount
        self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - loan.amount)
        self.data.loans[index].starttime = sp.timestamp_from_utc_now()


    @sp.entry_point
    def paid(self, index, amount):
        loan = self.data.loans[index]
        sp.verify(loan.borrower == sp.sender)
        sp.verify(amount >= loan.payback)
        sp.verify(loan.duration >= sp.timestamp_from_utc_now() - loan.starttime)
        sp.verify(self.data.loans[index].lent == True)
        self.data.loans[index].paid == True
        self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - loan.payback)
        self.data.balances[sp.sender].balance += loan.collateral
        self.data.balances[self.data.administrator].balance = sp.as_nat(self.data.balances[self.data.administrator].balance - loan.collateral)
        self.data.balances[loan.lender].balance += loan.payback
        
        
    @sp.entry_point
    def defaultor(self, index):
        loan = self.data.loans[index]
        sp.verify(sp.sender == self.data.administrator)
        sp.verify(loan.duration > sp.timestamp_from_utc_now() - loan.starttime)
        sp.verify(self.data.loans[index].lent == True)
        self.data.loans[index].paid == True
        self.data.balances[sp.sender].balance = sp.as_nat(self.data.balances[sp.sender].balance - loan.collateral) 
        self.data.balances[loan.lender].balance += loan.collateral

    @sp.entry_point
    def setAdministrator(self, params):
        sp.set_type(params, sp.TAddress)
        sp.verify(sp.sender == self.data.administrator)
        self.data.administrator = params

    @sp.entry_point
    def mint(self, params):
        sp.set_type(params, sp.TRecord(address = sp.TAddress, value = sp.TNat))
        sp.verify(sp.sender == self.data.administrator)
        self.addAddressIfNecessary(params.address)
        self.data.balances[params.address].balance += params.value
        self.data.totalSupply += params.value
    
    @sp.entry_point
    def getBalance(self, params):
      sp.transfer(self.data.balances[params.arg.owner].balance, sp.tez(0), sp.contract(sp.TNat, params.contractAddress , entry_point = "viewBalance").open_some())
      
    @sp.entry_point
    def getAdministrator(self, params):
        sp.transfer(self.data.administrator, sp.tez(0), sp.contract(sp.TAddress, params.contractAddress , entry_point = "viewAdministrator").open_some())

    @sp.entry_point
    def getLoans(self, params):
        sp.transfer(self.data.noLoans, sp.tez(0), sp.contract(sp.TNat, params.contractAddress , entry_point = "viewLoans").open_some())
      
    
    @sp.entry_point
    def getTotalSupply(self, params):
        sp.transfer(self.data.totalSupply, sp.tez(0), sp.contract(sp.TNat, params.contractAddress , entry_point = "viewTotalSupply").open_some())
        
    def addAddressIfNecessary(self, address):
        sp.if ~ self.data.balances.contains(address):
            self.data.balances[address] = sp.record(balance = 0)



class viewerContract(sp.Contract):
    def __init__(self, contract):
        self.contract = contract
        self.init()
        
    @sp.entry_point
    def viewBalance(self, params):
        sp.set_type(params, sp.TNat)
    
    @sp.entry_point
    def viewAdministrator(self, params):
        sp.set_type(params, sp.TAddress)
        
    @sp.entry_point
    def viewTotalSupply(self, params):
        sp.set_type(params, sp.TNat)
    
    @sp.entry_point
    def viewLoans(self, params):
        sp.set_type(params, sp.TNat)
    


if "templates" not in __name__:
    @sp.add_test(name = "P2PLend")
    def test():

        scenario = sp.test_scenario()
        scenario.h1("Simple Interest P2P Lending")

        scenario.table_of_contents()

        # sp.test_account generates ED25519 key-pairs deterministically:
        admin = sp.test_account("Administrator")
        alice = sp.test_account("Alice")
        bob   = sp.test_account("Robert")
        
        # Let's display the accounts:
        scenario.h1("Accounts")
        scenario.show([admin, alice, bob])

        scenario.h1("Contract")
        c1 = P2PLend(admin.address)
        
        scenario.h1("Entry points")
        scenario += c1
        
        scenario.h2("Admin mints a few coins")
        scenario += c1.mint(address = admin.address, value = 1000).run(sender = admin)
        
        scenario.h2("Admin mints a few coins for Alice")
        scenario += c1.mint(address = alice.address, value = 100).run(sender = admin)
        
        scenario.h2("Admin mints a few coins for Bob")
        scenario += c1.mint(address = bob.address, value = 100).run(sender = admin)


        scenario.h2("Alice issues a loan request value: 10")
        scenario += c1.borrowreq(qty = 100, dur = 86400).run(sender = alice)
        scenario.verify(c1.data.noLoans == 1)
        scenario.verify(c1.data.balances[alice.address].balance == 0)
        scenario.verify(c1.data.balances[admin.address].balance == 1100)

        scenario.h2("Bob wants to approve the loan")
        scenario += c1.lend(1).run(sender = bob)
        scenario.verify(c1.data.balances[alice.address].balance == 100)
        scenario.verify(c1.data.balances[bob.address].balance == 0)

        scenario.h2("Admin mints a few coins for Alice")
        scenario += c1.mint(address = alice.address, value = 8).run(sender = admin)

        scenario.h2("Alice wants to pay back the loan")
        scenario += c1.paid(index = 1,amount = 108).run(sender = alice)
        scenario.verify(c1.data.balances[alice.address].balance == 100)
        scenario.verify(c1.data.balances[bob.address].balance == 108)
        scenario.verify(c1.data.balances[admin.address].balance == 1000)
        
         
        scenario.h1("Views")
        c2 = viewerContract(c1)
        scenario += c2
        scenario.h2("Balance")
        scenario += c1.getBalance(arg = sp.record(owner = bob.address), contractAddress = c2.address)

        scenario.h2("Administrator")
        scenario += c1.getAdministrator(contractAddress = c2.address)
    
        scenario.h2("Total Supply")
        scenario += c1.getTotalSupply(contractAddress = c2.address)
        
        scenario.h2("Loans")
        scenario += c1.getLoans(contractAddress = c2.address)
        
        