export class Cep {
  private readonly value: string;

  constructor(cep: string) {
    this.validate(cep);
    this.value = this.format(cep);
  }

  private validate(cep: string): void {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
    if (!cepRegex.test(cep)) {
      throw new Error('CEP inválido. Formato aceito: XXXXX-XXX ou XXXXXXXX');
    }
  }

  private format(cep: string): string {
    return cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  getValue(): string {
    return this.value;
  }

  getRawValue(): string {
    return this.value.replace(/\D/g, '');
  }
}
