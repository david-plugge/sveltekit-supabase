export { default as auth } from './handlers/auth';
export { deleteSession, saveSession } from './helpers';

export { attachSession } from './handlers/session';
// TODO: remove this when the cookies api works correct
export { handleCallbackSession } from './handlers/callback';
