export class Seconds {
  constructor(private value: number) {
    if (value < 0) {
      throw new Error('Seconds cannot be negative');
    }
  }

  static empty() {
    return new Seconds(0);
  }

  static minutes(value: number) {
    return new Seconds(value * 60);
  }

  static hours(value: number) {
    return new Seconds(value * 60 * 60);
  }

  static days(value: number) {
    return new Seconds(value * 60 * 60 * 24);
  }

  equals(other: Seconds): boolean {
    return this.value === other.value;
  }

  difference(other: Seconds): Seconds {
    return new Seconds(Math.abs(this.value - other.value));
  }

  asHours() {
    return Math.round(this.value / 60 / 60);
  }
}
