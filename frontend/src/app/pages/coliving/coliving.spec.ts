import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coliving } from './coliving';

describe('Coliving', () => {
  let component: Coliving;
  let fixture: ComponentFixture<Coliving>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coliving]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coliving);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
