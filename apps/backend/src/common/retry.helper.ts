export async function retry<T>(
	fn: () => Promise<T>,
	retries = 5,
	delayMs = 500,
): Promise<T> {
	let attempt = 0;
	while (true) {
		try {
			return await fn();
		} catch (err) {
			attempt++;
			if (attempt > retries) throw err;
			// exponential backoff
			const backoff = delayMs * Math.pow(2, attempt - 1);
			await new Promise((res) => setTimeout(res, backoff));
		}
	}
}
