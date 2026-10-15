import json
import os
from datetime import datetime

DATA_FILE = "library_data.json"

class Library:
    def __init__(self, autosave=True):
        self.books = []
        self.loans = []
        self.users = {}
        self.next_id = 1
        self.autosave = autosave
        if autosave:
            self.load()

    # Сохранение 
    def save(self):
        if not self.autosave:
            return
        data = {
            "books": self.books,
            "loans": self.loans,
            "users": self.users,
            "next_id": self.next_id,
        }
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self):
        if not os.path.exists(DATA_FILE):
            return
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.books = data.get("books", [])
        self.loans = data.get("loans", [])
        self.users = data.get("users", {})
        self.next_id = data.get("next_id", 1)

    #Функционал 1: добавление книги
    def add_book(self, title, author, genre, year, copies):
        if not isinstance(title, str) or not title.strip():
            raise ValueError("Название не может быть пустым")
        if not isinstance(author, str) or not author.strip():
            raise ValueError("Автор не может быть пустым")
        if not isinstance(year, int) or year < 0 or year > datetime.now().year:
            raise ValueError("Некорректный год издания")
        if not isinstance(copies, int) or copies <= 0:
            raise ValueError("Количество экземпляров должно быть > 0")

        book = {
            "id": self.next_id,
            "title": title.strip(),
            "author": author.strip(),
            "genre": (genre or "").strip() or "Не указан",
            "year": year,
            "total_copies": copies,
            "available_copies": copies,
        }
        self.books.append(book)
        self.next_id += 1
        self.save()
        return book

    #Функционал 2: поиск
    def search(self, query):
        if not query:
            return list(self.books)
        q = query.lower().strip()
        return [
            b for b in self.books
            if q in b["title"].lower() or q in b["author"].lower()
        ]

    # Функционал 3: фильтрация
    def filter_books(self, genre=None, year_from=None, year_to=None,
                     only_available=False):
        result = list(self.books)
        if genre:
            result = [b for b in result if b["genre"].lower() == genre.lower()]
        if year_from is not None:
            result = [b for b in result if b["year"] >= year_from]
        if year_to is not None:
            result = [b for b in result if b["year"] <= year_to]
        if only_available:
            result = [b for b in result if b["available_copies"] > 0]
        return result

    # Функционал 4: выдача
    def take_book(self, book_id, username):
        if not username or not username.strip():
            raise ValueError("Имя пользователя не может быть пустым")
        book = self.get_book(book_id)
        if book is None:
            raise ValueError(f"Книга с id={book_id} не найдена")
        if book["available_copies"] <= 0:
            raise ValueError("Нет доступных экземпляров")
        if any(l["book_id"] == book_id and l["username"] == username
               for l in self.loans):
            raise ValueError("Вы уже взяли эту книгу")

        book["available_copies"] -= 1
        self.loans.append({
            "book_id": book_id,
            "username": username,
            "date_taken": datetime.now().strftime("%Y-%m-%d %H:%M"),
        })
        self.save()
        return book

    # Функционал 5: возврат
    def return_book(self, book_id, username):
        loan = next(
            (l for l in self.loans
             if l["book_id"] == book_id and l["username"] == username),
            None,
        )
        if loan is None:
            raise ValueError("Запись о выдаче не найдена")
        self.loans.remove(loan)
        book = self.get_book(book_id)
        book["available_copies"] += 1
        self.save()
        return book

    def get_book(self, book_id):
        return next((b for b in self.books if b["id"] == book_id), None)


#ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ CLI
def print_books(books):
    if not books:
        print("  ⚠ Ничего не найдено.")
        return
    print(f"  {'ID':<4}{'Название':<30}{'Автор':<22}{'Жанр':<15}"
          f"{'Год':<6}{'Доступно':<10}")
    print("  " + "-" * 85)
    for b in books:
        print(f"  {b['id']:<4}{b['title'][:28]:<30}{b['author'][:20]:<22}"
              f"{b['genre'][:13]:<15}{b['year']:<6}"
              f"{b['available_copies']}/{b['total_copies']}")


def input_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("  ❌ Ошибка: введите целое число.")


# ИНТЕРАКТИВНОЕ МЕНЮ
def menu():
    lib = Library()

    # данные при первом запуске
    if not lib.books:
        lib.add_book("Преступление и наказание", "Ф. Достоевский",
                     "Роман", 1866, 3)
        lib.add_book("Мастер и Маргарита", "М. Булгаков", "Роман", 1967, 2)
        lib.add_book("1984", "Дж. Оруэлл", "Антиутопия", 1949, 1)
        print("📚 Загружены демонстрационные книги.")

    current_user = "reader1"

    while True:
        print("\n" + "-" * 65)
        print(f"📖 ЭЛЕКТРОННАЯ БИБЛИОТЕКА   |   Пользователь: {current_user}")
        print("-" * 65)
        print(" 1. Показать все книги")
        print(" 2. Поиск по названию/автору")
        print(" 3. Фильтрация (жанр, год, доступность)")
        print(" 4. Взять книгу")
        print(" 5. Вернуть книгу")
        print(" 6. Добавить книгу (библиотекарь)")
        print(" 7. Мои выданные книги")
        print(" 8. Сменить пользователя")
        print(" 0. Выход")
        choice = input("Выберите пункт: ").strip()

        try:
            if choice == "1":
                print_books(lib.books)

            elif choice == "2":
                q = input("Введите запрос: ").strip()
                print_books(lib.search(q))

            elif choice == "3":
                genre = input("Жанр (Enter — пропустить): ").strip() or None
                yf = input("Год от (Enter — пропустить): ").strip()
                yt = input("Год до (Enter — пропустить): ").strip()
                only_av = input("Только доступные? (y/n): ").strip().lower() == "y"
                result = lib.filter_books(
                    genre=genre,
                    year_from=int(yf) if yf else None,
                    year_to=int(yt) if yt else None,
                    only_available=only_av,
                )
                print_books(result)

            elif choice == "4":
                bid = input_int("ID книги: ")
                lib.take_book(bid, current_user)
                print("  ✅ Книга выдана.")

            elif choice == "5":
                bid = input_int("ID книги: ")
                lib.return_book(bid, current_user)
                print("  ✅ Книга возвращена.")

            elif choice == "6":
                title = input("Название: ")
                author = input("Автор: ")
                genre = input("Жанр: ")
                year = input_int("Год: ")
                copies = input_int("Экземпляров: ")
                book = lib.add_book(title, author, genre, year, copies)
                print(f"  ✅ Добавлена книга id={book['id']}")

            elif choice == "7":
                my = [lib.get_book(l["book_id"]) for l in lib.loans
                      if l["username"] == current_user]
                print_books([b for b in my if b])

            elif choice == "8":
                new_user = input("Новое имя пользователя: ").strip()
                if not new_user:
                    print("  ❌ Имя не может быть пустым.")
                else:
                    current_user = new_user

            elif choice == "0":
                print("До свидания!")
                break
            else:
                print("  ❌ Неизвестный пункт меню.")

        except ValueError as e:
            print(f"  ❌ Ошибка: {e}")
        except Exception as e:
            print(f"  ❌ Непредвиденная ошибка: {e}")


# ТОЧКА ВХОДА
if __name__ == "__main__":
    menu()