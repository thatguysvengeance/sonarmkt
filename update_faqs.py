import os

base_dir = r"c:\Users\smsma\Documents\Sonar Marketing Website"

index_file = os.path.join(base_dir, "index.html")
book_file = os.path.join(base_dir, "book-a-call.html")

google_file = os.path.join(base_dir, "googleranking.html")
free_file = os.path.join(base_dir, "free-analysis.html")

def extract_faq(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if '<!-- FAQ Section -->' in line:
            start_idx = i
        if start_idx != -1 and '</section>' in line:
            end_idx = i
            break
            
    return lines[start_idx:end_idx+1], start_idx

def replace_faq(source_lines, target_filepath):
    with open(target_filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if '<!-- FAQ Section -->' in line:
            start_idx = i
        if start_idx != -1 and '</section>' in line:
            end_idx = i
            break
            
    if start_idx == -1 or end_idx == -1:
        print(f"FAQ not found in {target_filepath}")
        return
        
    # Calculate indent difference based on first line
    source_indent = len(source_lines[0]) - len(source_lines[0].lstrip())
    target_indent = len(lines[start_idx]) - len(lines[start_idx].lstrip())
    
    indent_diff = target_indent - source_indent
    
    new_faq = []
    for line in source_lines:
        if line.strip() == '':
            new_faq.append('\n')
        elif indent_diff > 0:
            new_faq.append((' ' * indent_diff) + line)
        elif indent_diff < 0:
            new_faq.append(line[-indent_diff:])
        else:
            new_faq.append(line)
            
    for i, line in enumerate(new_faq):
        if 'class="container reveal"' in line:
            new_faq[i] = line.replace('class="container reveal"', 'class="container"')
            
    lines[start_idx:end_idx+1] = new_faq
    
    with open(target_filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Updated {target_filepath}")

idx_faq, _ = extract_faq(index_file)
replace_faq(idx_faq, book_file)

ggl_faq, _ = extract_faq(google_file)
replace_faq(ggl_faq, free_file)
