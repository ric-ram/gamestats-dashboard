module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: '../',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['<rootDir>/src/**/*.spec.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				/* ts-jest options */
			},
		],
	},
};
