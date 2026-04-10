import sys
import logging

def greeting(name):
    try:
        if not name:
            raise ValueError("Name cannot be empty")
        print(f"Hey {name}")
    except Exception as e:
        logging.error(f"Error occurred: {e}")

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    if len(sys.argv) < 2:
        logging.error("Please provide a name as an argument")
        sys.exit(1)
    name = sys.argv[1]
    greeting(name)
