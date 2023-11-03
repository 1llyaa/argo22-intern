export {};

declare global {
	interface Window {
		showSearch: () => void;
		movieDetails: (id: string) => Promise<void>;
	}
}