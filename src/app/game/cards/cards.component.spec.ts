import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsComponent } from './cards.component';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
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
