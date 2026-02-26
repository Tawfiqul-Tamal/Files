# Program to count numbers divisible by 5

n = int(input("Enter a number: "))

count = 0

for i in range(1, n + 1):
    if i % 5 == 0:
        count += 1

print("Total numbers divisible by 5:", count)