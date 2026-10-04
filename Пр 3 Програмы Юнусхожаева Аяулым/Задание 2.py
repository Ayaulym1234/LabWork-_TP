#Product: название, цена, количество; изменение цены, добавление и стоимость запасов.

class Product:
    def __init__(self, name, cost, number):
        self.name= name
        self.cost= cost
        self.number= number
    def show(self):
        print(f"название: {self.name}")
        print(f"цена: {self.cost}")
        print(f"количество: {self.number}")
    def change_cost(self, newcost):
        print(f"цена: {newcost}")
        self.cost= newcost
    def add_stock(self, amount):
        print(f"количество: +{amount}")
        self.number += amount
    def value(self):
        return self.cost * self.number
    
p = Product("Laptop", 50000, 5)
p.show()

print(p.value())

p.add_stock(5)
p.change_cost(40000)
print(p.value())