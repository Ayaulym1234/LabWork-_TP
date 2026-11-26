books = []

def add_book(title):
    books.append(title)
    print(f"Книга '{title}' добавлена.")

def search_books(substring):
    if not books:
        print("Каталог пуст.")
        return
    
    search_sub = substring.lower()
    found = [] # Создаем пустой список
    for book in books: # Перебираем книги
    # Приводим название к нижнему регистру
        book_lower = book.lower() 
    # Проверяем условие
        if search_sub in book_lower: 
            found.append(book) # Если подходит, добавляем
    if found:
        print(f"Найдено ({len(found)}):", ", ".join(found))
    else:
        print("Ничего не найдено.")

def get_book_by_index(index):
    # Проверяем, не пустой ли каталог
    if not books:
        print("Каталог пуст.")
        return
    
    real_index = index - 1

    # Проверяем, существует ли книга с таким номером
    if 0 <= real_index < len(books):
        print(f"Книга под номером {index}: {books[real_index]}")
    else:
        print(f"Ошибка: Книги с номером {index} нет в каталоге (всего книг: {len(books)}).")

def remove_book(title):
    # Ищет книгу без учета регистра для удобства
    for book in books:
        if book.lower() == title.lower():
            books.remove(book)
            print(f"Книга '{book}' удалена.")
            return
    print(f"Ошибка: Книги '{title}' нет в каталоге.")

# ИНТЕРАКТИВНОЕ МЕНЮ
while True:
    print("\n--- КАТАЛОГ КНИГ ---")
    print("1. Добавить книгу")
    print("2. Показать все книги")
    print("3. Найти книгу")
    print("4. Удалить книгу")
    print("5. Найти книгу по номеру")
    print("6. Выход")
    
    choice = input("Выберите действие (1-6): ")

    if choice == '1':
        title = input("Введите название книги: ").strip()
        if title:
            add_book(title)
        else:
            print("Название не может быть пустым!")
            
    elif choice == '2':
        if books:
            print("Список книг:")
            for i, book in enumerate(books, 1):
                print(f"{i}. {book}")
        else:
            print("Каталог пуст.")
            
    elif choice == '3':
        query = input("Введите текст для поиска: ").strip()
        if query:
            search_books(query)
        else:
            print("Введите текст для поиска!")
            
    elif choice == '4':
        title = input("Введите название книги для удаления: ").strip()
        if title:
            remove_book(title)
        else:
            print("Название не может быть пустым!")

    elif choice == '5':
        try:
            # Превращаем введенный текст в число
            index_input = int(input("Введите номер книги: "))
            get_book_by_index(index_input)
        except ValueError:
            # Если пользователь ввел буквы вместо цифр
            print("Ошибка: Введите целое число!")
            
    elif choice == '6':
        print("Выход из программы. До свидания!")
        break
            
    elif choice == '6':
        print("Выход из программы. До свидания!")
        break
        
    else:
        print("Неверный ввод. Пожалуйста, выберите от 1 до 5.")