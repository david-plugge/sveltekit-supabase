# Supabase Auth helpers for SvelteKit

## How to run it

1. clone this repo `git clone https://github.com/david-plugge/supabase-auth-helpers-sk-new-api.git`
2. create a supabase project at https://app.supabase.com/
3. rename or copy `.env.example` to `.env` file and update the variables
4. run `pnpm install`
5. run `pnpm dev`

Disable JavaScript and see that signin/signup/logout still works

## How it works

It uses the [`invalidateAll`](https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall) method to refetch the session when the it´s about to expire or on signin/signout/etc.
This makes sense since any data currently displayed may not belong to the user anymore.

## Whats different

- No Svelte `SupaAuthHelper` component
- still works when JS fails
-

## Things to improve

- move the callback into a hook (not sure why this doesn´t work, seems to be a bug with the cookie api)
- provide custom enhance submit functions like `use:enhance={supabaseLogout}`
- provide some default server `actions` for all auth methods that can be implemented ssr only (don´t rely on the url hash)
  - signIn with email/phone
  - signUp with email/phone
  - signOut
- use [`invalidate('sb:auth')`](https://kit.svelte.dev/docs/modules#$app-navigation-invalidate) and [`depends('sb:auth')`](https://kit.svelte.dev/docs/load#input-methods-depends) to only force reloading authenticated data (not sure it this is necessary, needs some testing)
