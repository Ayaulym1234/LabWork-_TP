#Student: имя, возраст, специальность; вывод информации и изменение специальности.
class Student:
    def __init__(self, name, age, spec):
        self.name= name
        self.age = age
        self.spec= spec
    def show(self):
        print(f"Imya: {self.name}")
        print(f"Vozrast: {self.age}")
        print(f"Spechialntost: {self.spec}")
    def change(self, newspec):
        print(f"Novaya spechialnost: {newspec}")
        self.spec = newspec
    
s = Student("Aya", 19, "Informachyonnye sistemy")
s.show()

s.change("Computer Technology")
s.show()