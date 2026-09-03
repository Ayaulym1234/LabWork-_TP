# 1-ый вариант среднего уровня
s = int(input("Vvedite kolichestvo secund:"))
h = s // 3600
m = (s%3600) // 60
sec = s% 60
print(f"{h} ч, {m} м, {sec} с")