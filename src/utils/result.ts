export type Result<T, E> = Success<T> | Failure<E>;

export class Success<T> {
  constructor(public readonly value: T) {}

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<any> {
    return false;
  }
}

export class Failure<E> {
  constructor(public readonly error: E) {}

  isSuccess(): this is Success<any> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}
