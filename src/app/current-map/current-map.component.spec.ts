import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMapComponent } from './current-map.component';

describe('CurrentMapComponent', () => {
  let component: CurrentMapComponent;
  let fixture: ComponentFixture<CurrentMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
