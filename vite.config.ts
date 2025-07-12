import tailwindcss from '@tailwindcss/vite';
import { writeFile, readFile, readdir, stat, access } from 'fs/promises';
import path, { resolve, join, extname } from 'path';
import { defineConfig } from 'vite';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
import JScrewIt from 'jscrewit';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [
        tailwindcss(),
        {
            name: 'dev-url',
            configureServer(server) {
                const genParams = () =>
                    Math.random().toString(36).slice(2, 15) +
                    Math.random().toString(36).slice(2, 15);

                server.printUrls = () => {
                    const challenge = genParams();
                    console.log(
                        `  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m   \x1b[36mhttp://localhost:5173/?client_id=prod-xsso-riotgames&code_challenge=${challenge}\x1b[0m`
                    );
                };
            },
        },
        obfuscatorPlugin({
            options: {
                debugProtection: false,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                disableConsoleOutput: true,
                splitStrings: true,
            },
            apply: 'build',
            debugger: false,
        }),
        {
            name: 'jsfuck-encoder',
            apply: 'build',
            closeBundle: async (): Promise<void> => {
                console.log('starting encoding process...');
                const staticPath = resolve(__dirname, 'static');

                try {
                    await access(staticPath);
                } catch {
                    console.error('error: static directory not found');
                    return;
                }

                const convertString2Unicode = (s: string) => {
                    return s
                        .split('')
                        .map((char) => {
                            const hexVal = char.charCodeAt(0).toString(16);
                            return '\\u' + ('000' + hexVal).slice(-4);
                        })
                        .join('');
                };

                const processFile = async (filePath: string) => {
                    try {
                        const data = await readFile(filePath, 'utf8');
                        const isHtmlFile =
                            extname(filePath).toLowerCase() === '.html';
                        const TMPL = `document.write('__UNI__')`;
                        const jsString = isHtmlFile
                            ? TMPL.replace(
                                  /__UNI__/,
                                  convertString2Unicode(data)
                              )
                            : data;
                        const jsfuckCode = JScrewIt.encode(jsString);

                        const finalContent = isHtmlFile
                            ? `<script type="text/javascript">${jsfuckCode}</script>`
                            : jsfuckCode;

                        await writeFile(filePath, finalContent);
                        console.log(`encoded: ${filePath}`);
                    } catch (error) {
                        console.error(`failed to process ${filePath}:`, error);
                        throw error;
                    }
                };

                const walkDir = async (dir: string) => {
                    try {
                        const files = await readdir(dir);
                        const processPromises = [];

                        for (const file of files) {
                            const filePath = join(dir, file);
                            const stats = await stat(filePath);

                            if (stats.isDirectory()) {
                                console.log(`entering directory: ${filePath}`);
                                processPromises.push(walkDir(filePath));
                            } else if (/\.(js|html)$/i.test(file)) {
                                processPromises.push(processFile(filePath));
                            }
                        }

                        await Promise.all(processPromises);
                    } catch (error) {
                        console.error(
                            `error processing directory ${dir}:`,
                            error
                        );
                        throw error;
                    }
                };

                try {
                    await walkDir(staticPath);
                    console.log(
                        'successfully encoded all js and html files in static directory'
                    );
                } catch (err) {
                    console.error('fatal error:', err);
                    throw err;
                }
            },
        },
    ],
    build: {
        outDir: 'static',
        emptyOutDir: true,
        minify: 'terser',
        cssMinify: 'lightningcss',
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[hash][extname]',
                chunkFileNames: 'assets/[hash].js',
                entryFileNames: 'assets/[hash].js',
            },
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: [
                    'console.log',
                    'console.info',
                    'console.warn',
                    'console.error',
                ],
                passes: 2,
                ecma: 2020,
                dead_code: true,
                collapse_vars: true,
                reduce_vars: true,
            },
            format: {
                comments: false,
                ecma: 2020,
                wrap_iife: true,
            },
            mangle: {
                toplevel: true,
            },
            module: true,
            sourceMap: false,
        },
    },
    css: {
        lightningcss: {
            targets: {
                chrome: 95,
                firefox: 90,
                safari: 14,
                edge: 95,
            },
            drafts: {
                customMedia: true,
            },
            cssModules: {
                pattern: '[hash]',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
