import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'utcToLocal',
  standalone: true,
})
export class UtcToLocalPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return '';
    }

    // Check if 'Z' needs to be added
    const valueToParse =
      value.endsWith('Z') || value.includes('+') || value.includes('-')
        ? value
        : value + 'Z';

    // Now parse the date
    const utcDate = new Date(Date.parse(valueToParse));

    if (isNaN(utcDate.getTime())) {
      // Handle the invalid date here
      console.error('Invalid date:', value);
      return 'Invalid Date';
    }

    // Use Angular's DatePipe for formatting
    const datePipe = new DatePipe('pl-PL'); // You can use your own locale
    return datePipe.transform(utcDate, 'shortDate');
}
}
