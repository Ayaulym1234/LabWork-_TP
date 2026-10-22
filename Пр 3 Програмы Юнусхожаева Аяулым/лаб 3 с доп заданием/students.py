class Student:

    def __init__(self, name, age, specialty, course=1, grades=None):
        # Публичные атрибуты
        self.name = name
        self.age = age
        self.specialty = specialty
        self.course = course  # НОВЫЙ АТРИБУТ: курс обучения

        # НОВЫЙ АТРИБУТ: список оценок
        # Приватный — доступ только через методы
        self.__grades = grades if grades is not None else []

    # Геттеры / сеттеры для инкапсулированных данных 

    def get_grades(self):
        return self.__grades.copy()

    def add_grade(self, grade):
        if not isinstance(grade, int):
            print("Ошибка: оценка должна быть целым числом")
            return False
        if grade < 2 or grade > 5:
            print("Ошибка: оценка должна быть от 2 до 5")
            return False
        self.__grades.append(grade)
        print(f"Оценка {grade} добавлена студенту {self.name}")
        return True

    def get_average_grade(self):
        if not self.__grades:
            return 0.0
        return round(sum(self.__grades) / len(self.__grades), 2)

    # Изменение специальности

    def change_specialty(self, new_specialty):
        if not new_specialty or not new_specialty.strip():
            print("Ошибка: специальность не может быть пустой")
            return False
        old = self.specialty
        self.specialty = new_specialty.strip()
        print(f"Студент {self.name}: специальность изменена «{old}» → «{self.specialty}»")
        return True

    # Вывод информации

    def show_info(self):
        avg = self.get_average_grade()
        avg_str = f"{avg}" if self.__grades else "нет оценок"
        print("=" * 40)
        print(f"Студент:       {self.name}")
        print(f"Возраст:       {self.age} лет")
        print(f"Специальность: {self.specialty}")
        print(f"Курс:          {self.course}")
        print(f"Оценки:        {self.__grades if self.__grades else '—'}")
        print(f"Средний балл:  {avg_str}")
        print("=" * 40)

    def __str__(self):
        return f"Student({self.name}, {self.age} лет, {self.specialty}, {self.course} курс)"


# Демонстрация работы

if __name__ == "__main__":
    # Создание объекта
    student1 = Student("Айгерим Смагулова", 19, "Информатика", course=2)
    student1.show_info()

    # Добавление оценок
    student1.add_grade(5)
    student1.add_grade(4)
    student1.add_grade(5)
    student1.add_grade(3)

    # Попытка добавить некорректную оценку
    student1.add_grade(6)   # Ошибка: оценка должна быть от 2 до 5
    student1.add_grade("5") # Ошибка: оценка должна быть целым числом

    print()
    student1.show_info()

    # Смена специальности
    print()
    student1.change_specialty("Программная инженерия")
    student1.show_info()

    # Демонстрация инкапсуляции: прямой доступ к __grades невозможен
    print()
    print("Попытка прямого доступа к приватному атрибуту:")
    try:
        print(student1.__grades)
    except AttributeError as e:
        print(f"  AttributeError: {e}")
    print("Доступ через метод get_grades():", student1.get_grades())

    # Средний балл
    print(f"\nСредний балл: {student1.get_average_grade()}")

    # Строковое представление
    print(student1)