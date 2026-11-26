from collections import deque

# Создаем две очереди (FIFO)
urgent_queue = deque()  # Срочные
normal_queue = deque()  # Обычные

# 1. Добавление задачи
def add_task(name, is_urgent):
    if is_urgent:
        urgent_queue.append(name)
        print(f"Срочная задача '{name}' добавлена.")
    else:
        normal_queue.append(name)
        print(f"Обычная задача '{name}' добавлена.")

# 2. Обслуживание (взятие в работу) следующей задачи
def process_task():
    # Проверяем, есть ли вообще задачи
    if not urgent_queue and not normal_queue:
        print("Очередь пуста. Нет задач для выполнения.")
        return

    # Приоритет: сначала срочные, потом обычные
    if urgent_queue:
        task = urgent_queue.popleft() # popleft берет первый элемент (FIFO)
        print(f"Взята в работу СРОЧНАЯ задача: {task}")
    else:
        task = normal_queue.popleft()
        print(f"Взята в работу обычная задача: {task}")

# 3. Просмотр очередей
def show_queues():
    print(f"\nСрочные ({len(urgent_queue)}): {list(urgent_queue)}")
    print(f"Обычные ({len(normal_queue)}): {list(normal_queue)}")

# === ИНТЕРАКТИВНОЕ МЕНЮ ===
while True:
    print("\n--- ПЛАНИРОВЩИК ЗАДАЧ ---")
    print("1. Добавить обычную задачу")
    print("2. Добавить срочную задачу")
    print("3. Взять задачу в работу (выполнить)")
    print("4. Показать текущие очереди")
    print("5. Выход")
    
    choice = input("Выберите действие (1-5): ").strip()

    if choice == '1':
        name = input("Название задачи: ").strip()
        if name: add_task(name, is_urgent=False)
        
    elif choice == '2':
        name = input("Название задачи: ").strip()
        if name: add_task(name, is_urgent=True)
        
    elif choice == '3':
        process_task()
        
    elif choice == '4':
        show_queues()
        
    elif choice == '5':
        print("Выход из программы.")
        break
    else:
        print("Неверный ввод.")