# Supabase Auth helpers for SvelteKit

## How it works

It uses the `invalidateAll` method to refetch the session when the it´s about to expire or on signin/signout/etc.
This makes sense since any data currently displayed may not belong to the user anymore.

## Things to improve

- move the callback into a hook (not sure why this doesn´t work, seems to be a bug with the cookie api)
- provide some default `actions` for all auth methods that can be implemented ssr only (don´t rely on the url hash)
  - signIn with email/phone
  - signUp with email/phone
  - signOut
- use `invalidate('sb:auth')` to only force reloading authenticated data
