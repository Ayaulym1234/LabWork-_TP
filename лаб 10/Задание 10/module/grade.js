// Считает средний балл для ОДНОГО студента (на основе массива его оценок)
export function calcStudentAverage(grades) {
    if (grades.length === 0) return 0;
    
    let sum = 0;
    for (let i = 0; i < grades.length; i++) {
        sum += grades[i];
    }
    return sum / grades.length;
}

// Считает средний балл для ВСЕЙ группы (массива студентов)
export function calcClassAverage(students) {
    if (students.length === 0) return 0;

    let totalSum = 0;
    for (let i = 0; i < students.length; i++) {
        totalSum += calcStudentAverage(students[i].grades);
    }
    return totalSum / students.length;
}