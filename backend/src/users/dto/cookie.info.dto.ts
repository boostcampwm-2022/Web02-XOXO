class CookieOptionDto {
  httpOnly: boolean;

  expiresIn?: number;

  maxAge?: number;
}

export default class CookieDto {
  private name: string;

  private value: string;

  private option: CookieOptionDto;

  constructor(name: string, value: string, option: CookieOptionDto) {
    this.name = name;
    this.value = value;
    this.option = option;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }

  getOption() {
    return this.option;
  }
}
