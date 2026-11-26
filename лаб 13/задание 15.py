# Словарь, где ключ - это ID, а значение - словарь с данными книги
library = {
    "101": {"title": "Война и мир", "is_available": True},
    "102": {"title": "Преступление и наказание", "is_available": True},
    "103": {"title": "Мастер и Маргарита", "is_available": False} # Уже выдана
}

# 1. Выдача книги
def issue_book(book_id):
    if book_id not in library:
        print("Ошибка: Книги с таким ID нет.")
        return
    
    book = library[book_id]
    if book["is_available"]:
        book["is_available"] = False
        print(f"Книга '{book['title']}' выдана.")
    else:
        print(f"Ошибка: Книга '{book['title']}' уже выдана.")

# 2. Возврат книги
def return_book(book_id):
    if book_id not in library:
        print("Ошибка: Книги с таким ID нет.")
        return
        
    book = library[book_id]
    if not book["is_available"]:
        book["is_available"] = True
        print(f"Книга '{book['title']}' возвращена.")
    else:
        print(f"Ошибка: Книга '{book['title']}' и так в библиотеке.")

# 3. Список доступных книг
def show_available_books():
    print("\n--- Доступные книги ---")
    found = False
    for book_id, book in library.items():
        if book["is_available"]:
            print(f"ID: {book_id} | {book['title']}")
            found = True
            
    if not found:
        print("Нет доступных книг.")

# === ИНТЕРАКТИВНОЕ МЕНЮ ===
while True:
    print("\n--- МИНИ-БИБЛИОТЕКА ---")
    print("1. Выдать книгу")
    print("2. Вернуть книгу")
    print("3. Показать доступные книги")
    print("4. Выход")
    
    choice = input("Выберите действие (1-4): ").strip()

    if choice == '1':
        b_id = input("Введите ID книги для выдачи: ").strip()
        issue_book(b_id)
        
    elif choice == '2':
        b_id = input("Введите ID книги для возврата: ").strip()
        return_book(b_id)
        
    elif choice == '3':
        show_available_books()
        
    elif choice == '4':
        print("Выход из программы.")
        break
    else:
        print("Неверный ввод. Попробуйте снова.")