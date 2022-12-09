import { Exclude, Expose } from 'class-transformer';

export class ResponseDto {
  @Exclude()
  private readonly _success: true;

  @Exclude()
  private readonly _code: number;

  @Exclude()
  private readonly _data: any;

  private constructor(status: number, data: any) {
    this._success = true;
    this._code = status;
    this._data = data;
  }

  static OK(): ResponseDto {
    return new ResponseDto(200, '');
  }

  static OK_WITH_DATA(data: any): ResponseDto {
    return new ResponseDto(200, data);
  }

  static CREATED(): ResponseDto {
    return new ResponseDto(201, '');
  }

  static CREATED_WITH_DATA(data: any): ResponseDto {
    return new ResponseDto(201, data);
  }

  @Expose()
  get success(): true {
    return this._success;
  }

  @Expose()
  get code() {
    return this._code;
  }

  @Expose()
  get data() {
    return this._data;
  }
}
export default ResponseDto;
