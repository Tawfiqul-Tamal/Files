# Program to find sum of even and odd numbers

n = int(input("Enter a number: "))

even_sum = 0
odd_sum = 0

for i in range(1, n + 1):
    if i % 2 == 0:
        even_sum += i
    else:
        odd_sum += i

print("Sum of Even numbers:", even_sum)
print("Sum of Odd numbers:", odd_sum)