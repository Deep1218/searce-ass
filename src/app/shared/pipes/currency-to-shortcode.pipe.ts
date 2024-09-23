import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyToShortcode',
  standalone: true,
})
export class CurrencyToShortcodePipe implements PipeTransform {
  transform(value: number): string {
    value = +value;
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(2) + ' L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' K';
    } else {
      return value.toString();
    }
  }
}
