import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly Success: true;

  @Exclude() private readonly Status: number;

  @Exclude() private readonly Data: T;

  protected constructor(status: number, data: T) {
    this.Success = true;
    this.Status = status;
    this.Data = data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(200, '');
  }

  static OK_WITH_DATA<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(200, data);
  }

  static CREATED(): ResponseEntity<string> {
    return new ResponseEntity(201, '');
  }

  static CREATED_WITH_DATA<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(201, data);
  }

  @Expose()
  get success() {
    return this.Success;
  }

  @Expose()
  get status() {
    return this.Status;
  }

  @Expose()
  get data(): T {
    return this.Data;
  }
}
export default ResponseEntity;
