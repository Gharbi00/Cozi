import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coworking } from './coworking';

describe('Coworking', () => {
  let component: Coworking;
  let fixture: ComponentFixture<Coworking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coworking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coworking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
