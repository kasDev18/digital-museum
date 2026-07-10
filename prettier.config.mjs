/**
 * Prettier configuration with Tailwind CSS class sorting.
 */

/** @type {import('prettier').Config} */
export default {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    tabWidth: 2,
    arrowParens: 'avoid',
    plugins: ['prettier-plugin-tailwindcss'],
};
