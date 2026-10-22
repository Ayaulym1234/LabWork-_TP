class Product:

    def __init__(self, name, price, quantity, category="Без категории", discount=0):
        self.name = name
        self.__price = price          # инкапсулированный атрибут
        self.__quantity = quantity    # инкапсулированный атрибут
        self.category = category      # НОВЫЙ АТРИБУТ: категория товара
        self.__discount = discount    # НОВЫЙ АТРИБУТ: скидка в процентах

    #Геттеры

    def get_price(self):
        return self.__price

    def get_quantity(self):
        return self.__quantity

    def get_discount(self):
        return self.__discount

    #Изменение цены

    def change_price(self, new_price):
        """Изменяет цену товара с проверкой."""
        if not isinstance(new_price, (int, float)):
            print("Ошибка: цена должна быть числом")
            return False
        if new_price <= 0:
            print("Ошибка: цена должна быть больше 0")
            return False
        old = self.__price
        self.__price = new_price
        print(f"Товар «{self.name}»: цена изменена {old} → {new_price}")
        return True

    #Добавление запасов

    def add_stock(self, amount):
        """Добавляет количество товара на склад."""
        if not isinstance(amount, int):
            print("Ошибка: количество должно быть целым числом")
            return False
        if amount <= 0:
            print("Ошибка: количество должно быть больше 0")
            return False
        self.__quantity += amount
        print(f"Товар «{self.name}»: на склад добавлено {amount} шт. (всего: {self.__quantity})")
        return True

    #Стоимость запасов

    def get_stock_value(self):
        """Возвращает общую стоимость запасов (цена × количество)."""
        return round(self.__price * self.__quantity, 2)

    #НОВЫЙ МЕТОД: применить скидку

    def apply_discount(self, percent):
        """ НОВЫЙ МЕТОД: применяет скидку в процентах к цене."""
        if not isinstance(percent, (int, float)):
            print("Ошибка: скидка должна быть числом")
            return False
        if percent < 0 or percent > 90:
            print("Ошибка: скидка должна быть от 0 до 90%")
            return False
        self.__discount = percent
        final_price = self.get_final_price()
        print(f"Товар «{self.name}»: скидка {percent}% "
              f"(цена со скидкой: {final_price})")
        return True

    #НОВЫЙ МЕТОД: цена со скидкой

    def get_final_price(self):
        return round(self.__price * (1 - self.__discount / 100), 2)

    # НОВЫЙ МЕТОД: продажа товара

    def sell(self, count):
        if not isinstance(count, int):
            print("Ошибка: количество должно быть целым числом")
            return False
        if count <= 0:
            print("Ошибка: количество должно быть больше 0")
            return False
        if count > self.__quantity:
            print(f"Ошибка: недостаточно товара (на складе {self.__quantity}, запрошено {count})")
            return False
        self.__quantity -= count
        revenue = round(self.get_final_price() * count, 2)
        print(f"Товар «{self.name}»: продано {count} шт. на сумму {revenue}. "
              f"Остаток: {self.__quantity}")
        return True

    # Вывод информации

    def show_info(self):
        """Выводит всю информацию о товаре."""
        print("=" * 42)
        print(f"Название:        {self.name}")
        print(f"Категория:       {self.category}")
        print(f"Цена:            {self.__price}")
        print(f"Скидка:          {self.__discount}%")
        print(f"Цена со скидкой: {self.get_final_price()}")
        print(f"Количество:      {self.__quantity} шт.")
        print(f"Стоимость запаса:{self.get_stock_value()}")
        print("=" * 42)

    def __str__(self):
        return f"Product({self.name}, {self.__price} тг, {self.__quantity} шт.)"


# Демонстрация работы

if __name__ == "__main__":
    # Создание товара
    p1 = Product("Ноутбук Lenovo", 250000, 15, category="Электроника")
    p1.show_info()

    # Изменение цены
    print()
    p1.change_price(230000)

    # Добавление запасов
    p1.add_stock(5)

    # Попытка добавить отрицательное количество
    p1.add_stock(-3)

    print()
    p1.show_info()

    # Применение скидки
    print()
    p1.apply_discount(10)
    p1.show_info()

    # Продажа товара
    print()
    p1.sell(3)
    p1.sell(100)  # Ошибка: недостаточно товара

    # Стоимость запасов
    print(f"\nОбщая стоимость запасов: {p1.get_stock_value()} тг")

    # Демонстрация инкапсуляции
    print("\nПопытка прямого доступа к приватным атрибутам:")
    try:
        print(p1.__price)
    except AttributeError as e:
        print(f"  AttributeError: {e}")

    print(p1)