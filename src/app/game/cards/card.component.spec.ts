import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CardComponent} from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the front face using the given card', () => {
    component.card = 'stegosaurus';
    component.imgUrl = 'dinos';
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('img.front-face');
    expect(image.getAttribute('src')).toBe('assets/img/dinos/stegosaurus.svg');
  });

  it('renders a colored star cover on the back face, cycling by coverIndex', () => {
    component.coverIndex = 1;
    fixture.detectChanges();

    const back: HTMLElement = fixture.nativeElement.querySelector('.back-face');
    expect(back).toBeTruthy();
    expect(back.querySelector('svg.cover-star')).toBeTruthy();
    expect(back.style.background).toBe(component.cover.bg);
  });

});
