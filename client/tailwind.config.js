module.exports = {
  // Enable JIT mode for faster build times
  mode: 'jit',
  // Specify the paths to all of the templates in the project
  purge: [
    './client/src/**/*.html',
    './client/src/**/*.js',
    './client/src/**/*.jsx',
    './client/src/**/*.ts',
    './client/src/**/*.tsx',
  ],
  darkMode: 'media', // Or 'class' for dark mode toggle
  theme: {
    extend: {
      // Extend the default Tailwind theme here
      colors: {
        primary: {
          light: '#4f46e5',
          DEFAULT: '#3b82f6',
          dark: '#3730a3',
        },
        secondary: {
          light: '#d1d5db',
          DEFAULT: '#9ca3af',
          dark: '#4b5563',
        },
        accent: {
          light: '#f472b6',
          DEFAULT: '#db2777',
          dark: '#9d174d',
        },
      },
    },
  },
  variants: {
    extend: {
      // Extend variants for specific utilities
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Form styles
    require('@tailwindcss/typography'), // Better typography
    require('@tailwindcss/aspect-ratio'), // Aspect ratio utilities
  ],
  important: true, // Makes all Tailwind utility classes have higher specificity
};