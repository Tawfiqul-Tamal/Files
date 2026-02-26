# Program to find factorial of a number

number = int(input("Enter a number: "))

factorial = 1

if number < 0:
    print("Factorial does not exist for negative numbers")
elif number == 0:
    print("Factorial of 0 is 1")
else:
    for i in range(1, number + 1):
        factorial *= i
    print("Factorial of", number, "is", factorial)