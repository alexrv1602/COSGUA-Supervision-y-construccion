import re

def repl(match):
    global count
    res = f'https://picsum.photos/seed/coswa{count}/800/600'
    count += 1
    return res

count = 1
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'https://images\.unsplash\.com/[^\"\s]+', repl, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
