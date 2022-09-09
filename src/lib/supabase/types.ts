export interface CookieOptions {
	domain?: string;
	expires?: Date;
	httpOnly?: boolean;
	maxAge?: number;
	path?: string;
	priority?: 'low' | 'medium' | 'high';
	sameSite?: boolean | 'lax' | 'strict' | 'none';
	secure?: boolean;
}
