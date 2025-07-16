module.exports = {
	preset: 'ts-jest', // compile TS on the fly
	testEnvironment: 'node', // use Node for integration tests
	roots: ['<rootDir>/integration'],
	testMatch: ['**/*.integration-spec.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				/* ts-jest options */
			},
		],
	},
	// If you use path aliases (@backend/*), map them:
	moduleNameMapper: {
		'^@backend/(.*)$': '<rootDir>/src/$1',
	},
	// Clear mocks between tests
	clearMocks: true,
	// Show full error messages
	verbose: true,
};
