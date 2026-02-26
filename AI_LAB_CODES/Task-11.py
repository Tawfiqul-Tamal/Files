# Program to find sum of first N natural numbers

n = int(input("Enter N: "))

sum_of_numbers = 0

for i in range(1, n + 1):
    sum_of_numbers += i

print("Sum of first", n, "natural numbers is:", sum_of_numbers)