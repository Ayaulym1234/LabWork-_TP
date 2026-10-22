class ATMA:
    def __init__(self, pin, balance=0):
        self.__pin = pin
        self.__balance = balance
        self.daily_limit = 50000      # НОВЫЙ АТРИБУТ: дневной лимит снятия
        self.__history = []           # НОВЫЙ АТРИБУТ: история операций

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
        self.__history.append(f"Popolnenie: {amount}")
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
        if amount > self.daily_limit:
            print(f"Prevyshen dnevnoi limit ({self.daily_limit})")
            return
        self.__balance -= amount
        self.__history.append(f"Snyatie: {amount}")
        print(f"Snyato: {amount}. Balans: {self.__balance}")

    # НОВЫЙ МЕТОД: перевод другому счёту
    def transfer(self, pin, target, amount):
        if not self.check_pin(pin):
            print("Nevernyi PIN")
            return
        if not isinstance(target, ATMA):
            print("Poluchatel dolzhen byt ATMA")
            return
        if target is self:
            print("Nelzya perevesti samomu sebe")
            return
        if amount <= 0:
            print("Deneg ne vizhu")
            return
        if amount > self.__balance:
            print("Deneg net")
            return
        self.__balance -= amount
        target.__balance += amount
        self.__history.append(f"Perevod: {amount}")
        target.__history.append(f"Vhodyashiy perevod: {amount}")
        print(f"Perevedeno: {amount}. Balans: {self.__balance}")

    # НОВЫЙ МЕТОД: история операций
    def show_history(self, pin):
        if not self.check_pin(pin):
            print("Nevernyi PIN")
            return None
        if not self.__history:
            print("Istoriya pustaya")
            return []
        print("=== Istoriya operaciy ===")
        for i, record in enumerate(self.__history, 1):
            print(f"{i}. {record}")
        return self.__history.copy()


acc = ATMA(pin=1234, balance=1000)
acc2 = ATMA(pin=5678, balance=500)

acc.get_balance(1111)
print(acc.get_balance(1234))

acc.deposit(1234, 500)
acc.withdraw(1234, 200)
acc.withdraw(1234, 9999)

acc.transfer(1234, acc2, 300)
acc.transfer(1234, acc, 100)

acc.show_history(1234)
acc2.show_history(5678)