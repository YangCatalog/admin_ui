import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://sandbox.ietf.org/api/openid',

  // The SPA is registered with this id at the auth-server
  clientId: '755776',

  redirectUri: window.location.origin + '/api/admin/ping',

  responseType: 'code',
  // set the scope for the permissions the client should request
  scope: 'openid email profile',
};
