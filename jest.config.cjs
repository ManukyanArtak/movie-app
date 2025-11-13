module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                    esModuleInterop: true,
                    isolatedModules: true,
                },
            },
        ],
        '^.+\\.(js|jsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    allowJs: true,
                    esModuleInterop: true,
                },
            },
        ],
    },
    testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|tsx)'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/styleMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!clsx)',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/index.ts',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
};
