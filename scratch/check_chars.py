with open(r'c:\Users\smsma\Documents\Sonar Marketing Website\book-discovery.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines[130:150], 131):
        print(f"{i}: {repr(line)}")
