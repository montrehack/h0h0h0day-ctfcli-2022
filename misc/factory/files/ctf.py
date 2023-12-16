#!/usr/bin/python2

import sys

def h0h0lose():
    print("Wrong password, are you a spy ?")
    sys.exit(1)

try:
    with open(".passwd") as file:
        password = file.readline().strip()
except:
    print "Please start program with sudo (sudo ./factory.py)"
    sys.exit(1)

try:
    guess = input("What's the password ? ")
except:
    h0h0lose()

if (guess == int(password)):
    print "Welcome to my factory, you guessed correctly ! h0h0h0 !"
    sys.exit(1)
else:
    h0h0lose()

