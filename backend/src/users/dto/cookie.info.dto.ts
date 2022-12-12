class CookieOptionDto {
  httpOnly: boolean;

  expiresIn?: number;

  maxAge?: number;
}

export default class CookieDto {
  private Name: string;

  private Value: string;

  private Option: CookieOptionDto;

  constructor(name: string, value: string, option: CookieOptionDto) {
    this.Name = name;
    this.Value = value;
    this.Option = option;
  }

  get name() {
    return this.Name;
  }

  get value() {
    return this.Value;
  }

  get option() {
    return { domain: process.env.CLIENT_URL_PREFIX, ...this.Option };
  }
}
