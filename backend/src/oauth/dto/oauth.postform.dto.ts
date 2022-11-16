export default class PostFormDto {
  constructor(clientId: string, redirectUri: string, code: string) {
    this.grant_type = 'authorization_code';
    this.client_id = clientId;
    this.redirect_uri = redirectUri;
    this.code = code;
  }

  grant_type: string;

  client_id: string;

  redirect_uri: string;

  code: string;
}
