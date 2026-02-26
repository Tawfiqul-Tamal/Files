# Program to find the sum of digits of a number using while loop

num = int(input("Enter number: "))
total = 0

while num > 0:
    total += num % 10  
    num = num // 10    

print("Sum of digits:", total)