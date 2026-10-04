#ATMAccount: закрытые баланс и PIN; проверка PIN, баланс, пополнение и снятие.

class ATMA:
    def __init__(self, pin, balance=0):
        self.__pin = pin
        self.__balance = balance 
    def check_pin(self, pin):
        return pin == self.__pin
    def get_balance(self, pin):
        if not self.check_pin(pin):
            print("Nevernyi PIN")
            return None
        return self.__balance
    def deposit(self, pin, amount):
        if not self.check_pin(pin):
            print("Nevernyi PIN")
            return
        if amount <= 0:
            print("Deneg ne vizhu")
            return
        self.__balance += amount
        print(f"popolneno: {amount}. balans: {self.__balance}")
    def withdraw(self, pin, amount):
        if not self.check_pin(pin):
            print("Nevernyi PIN")
            return
        if amount <= 0:
            print("Deneg ne vizhu")
            return
        if amount > self.__balance:
            print("Deneg net")
            return
        self.__balance -= amount
        print(f"Snyato: {amount}. Balans: {self.__balance}")

acc = ATMA(pin=1234, balance=1000)

acc.get_balance(1111)
print(acc.get_balance(1234))

acc.deposit(1234, 500)
acc.withdraw(1234, 200)
acc.withdraw(1234, 9999)