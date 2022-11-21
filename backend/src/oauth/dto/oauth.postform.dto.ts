import { IsNotEmpty, IsString } from 'class-validator';

export default class PostFormDto {
  constructor(clientId: string, redirectUri: string, code: string) {
    this.grant_type = 'authorization_code';
    this.client_id = clientId;
    this.redirect_uri = redirectUri;
    this.code = code;
  }

  @IsNotEmpty()
  @IsString()
  grant_type: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  redirect_uri: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
