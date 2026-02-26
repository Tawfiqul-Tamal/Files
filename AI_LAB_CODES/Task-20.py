# Program to find the sum of digits of a number entered by the user

s = input("Enter number: ")
total = 0

for char in s:
    if char.isdigit():  # Check if the character is a digit
        total += int(char)

print("Sum of digits:", total)