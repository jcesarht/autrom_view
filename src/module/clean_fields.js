const fs = require('fs');
const path = require('path');

const vueDir = path.join('d:', 'develop_python', 'django', 'autrom_vue', 'src', 'module');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('Register.vue') || file.endsWith('Update.vue')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(vueDir);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const orig = content;
    
    // Remove UIInputText/UIAutocomplete for com and _create_at and _update_at
    const removeRegex = /<div>\s*<(UIInputText|UIAutocomplete|UIInputDate)[^>]*name=\"(com|[a-zA-Z0-9_]+_(create_at|update_at))\"[\s\S]*?<\/\1>\s*<\/div>|<div>\s*<(UIInputText|UIAutocomplete|UIInputDate)[^>]*name=\"(com|[a-zA-Z0-9_]+_(create_at|update_at))\"[^>]*\/>\s*<\/div>/g;
    content = content.replace(removeRegex, '');

    // In Register.vue, remove sub completely
    if (file.endsWith('Register.vue')) {
        const removeSubRegex = /<div>\s*<(UIInputText|UIAutocomplete|UIInputDate)[^>]*name=\"sub\"[\s\S]*?<\/\1>\s*<\/div>|<div>\s*<(UIInputText|UIAutocomplete|UIInputDate)[^>]*name=\"sub\"[^>]*\/>\s*<\/div>/g;
        content = content.replace(removeSubRegex, '');
    }

    if (content !== orig) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
