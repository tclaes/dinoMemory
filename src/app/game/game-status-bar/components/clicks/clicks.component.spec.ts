import {describe, it} from 'vitest';
import {render} from '@testing-library/angular';
import {ClicksComponent} from './clicks.component';

describe('Clicks', () => {
  it('should render correctly', () => {
    render(ClicksComponent);
  })
})
