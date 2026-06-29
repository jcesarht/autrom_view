import os
import re

vue_dir = r'd:\develop_python\django\autrom_vue\src\module'

def remove_blocks(content, names):
    for name in names:
        pattern = r'\s*<div>\s*<(?:UIInputText|UIAutocomplete|UIInputDate)[^>]*name=[\"\']' + re.escape(name) + r'[\"\'][^>]*>(?:.*?</(?:UIInputText|UIAutocomplete|UIInputDate)>)?\s*</div>'
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content

for root, dirs, files in os.walk(vue_dir):
    for file in files:
        if file.endswith('.vue') and (file == 'Register.vue' or file == 'Update.vue'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            names_to_remove = ['com']
            matches = re.findall(r'name=[\"\']([a-zA-Z0-9_]+_(?:create_at|update_at))[\"\']', content)
            names_to_remove.extend(matches)
            
            if file == 'Register.vue':
                names_to_remove.append('sub')
            
            orig_content = content
            content = remove_blocks(content, names_to_remove)
            
            if content != orig_content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {path}')
