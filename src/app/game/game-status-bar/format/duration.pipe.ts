import {Pipe, PipeTransform} from '@angular/core';
import {formatDuration} from './format-duration';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
  transform(ms: number): string {
    return formatDuration(ms);
  }
}
