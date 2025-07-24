#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let content = '';

rl.on('line', (line) => {
    content += line + '\n';
});

rl.on('close', () => {
    const cleaned = content.replace(/"api_key":\s*"[^"]*"/, '"api_key": ""');
    process.stdout.write(cleaned);
});
