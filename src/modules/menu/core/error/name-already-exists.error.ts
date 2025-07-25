import { DomainError } from '@api/modules/common/error/domain.error';

export class NameAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`The name "${name}" is already registered`);

    this.name = 'NameAlreadyExistsError';
  }
}
