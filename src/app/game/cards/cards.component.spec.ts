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

  it('renders both faces using the given inputs', () => {
    component.card = 'stegosaurus';
    component.imgUrl = 'dinos';
    component.frontFace = 'velociraptor';
    fixture.detectChanges();

    const images: NodeListOf<HTMLImageElement> = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(2);
    expect(images[0].getAttribute('src')).toBe('assets/img/dinos/stegosaurus.svg');
    expect(images[1].getAttribute('src')).toBe('assets/img/dinos/velociraptor.svg');
  });

});
