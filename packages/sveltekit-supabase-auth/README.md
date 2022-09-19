# SvelteKit Supabase Auth

## How to run it

Copy all contents inside [_src/package_](src/package/) into a folder in your project eg. _src/lib/supabase_.

All imports used in this repo will then have to be replaced to match the path in your project.

## How it works

It uses the [`invalidateAll`](https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall) method to refetch the session when the it´s about to expire or on signin/signout/etc.
This makes sense since any data currently displayed may not belong to the user anymore.

If you don´t care about non JS situations you can just ignore actions and use the auth methods on the supabaseClient instance, the session will always be synced to the server.

## Whats different

- No need for a `SupaAuthHelper` component
- still works when JS fails
- integrates nicely with SvelteKit´s actions

## Things to improve

- [x] helpers
  - [x] `supabaseServerClient(session.accessToken)`
  - [x] `saveSession(cookies, session)`
  - [x] `clearSession(cookies)`
  - [x] `loadWithSession(...)`
  - [x] `serverLoadWithSession(...)`
  - [x] `serverWithSession(...)`
- [x] custom enhance functions
  - [x] `use:enhanceAndInvalidate` - invalidates the page if it´s a redirect ur success type
- [ ] move the callback into a hook (not sure why this doesn´t work, seems to be a bug with the cookie api)
- [ ] use [`invalidate('sb:auth')`](https://kit.svelte.dev/docs/modules#$app-navigation-invalidate) and [`depends('sb:auth')`](https://kit.svelte.dev/docs/load#input-methods-depends) to only force reloading authenticated data (not sure if this is necessary, needs some testing)
- [ ] allow customizing the session location (something else than `locals.user` and `$page.data.session`)
- [ ] add a session store to reduce `$page.data.session` to just `$session`

## Minimal setup

[_/src/app.d.ts_](src/app.d.ts)

```ts
declare namespace App {
	interface SupabaseSession {
		user: import('@supabase/supabase-js').User | null;
		accessToken: string | null;
	}

	interface Locals {
		user: import('@supabase/supabase-js').User | null;
		accessToken: string | null;
		error: string | null;
	}
	interface PageData {
		session: SupabaseSession;
	}
	// interface Platform {}
}
```

[_/src/lib/db.ts_](src/lib/db.ts)

```ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	persistSession: false,
	autoRefreshToken: false
});
```

[_/src/hooks.server.ts_](src/hooks.server.ts)

```ts
import { dev } from '$app/environment';
import { supabaseClient } from '$lib/db';
import { auth } from '$lib/supabase/server';

export const handle = auth({
	supabaseClient,
	cookieOptions: {
		secure: !dev
	}
});
```

[_/src/routes/+layout.server.ts_](src/routes/+layout.server.ts)

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: {
			user: locals.user,
			accessToken: locals.accessToken
		}
	};
};
```

[_/src/routes/+layout.svelte_](src/routes/+layout.svelte)

```html
<script lang="ts" context="module">
	import { supabaseClient } from '$lib/db';
	import { setupSupabase } from '$lib/supabase';

	// set the supabase instance so it can be used in helpers
	setupSupabase({ supabaseClient });
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { startSupabaseSessionSync, enhanceAndInvalidate } from '$lib/supabase';

	// sync session and refresh data when necessary
	startSupabaseSessionSync();
</script>

<slot />
```
