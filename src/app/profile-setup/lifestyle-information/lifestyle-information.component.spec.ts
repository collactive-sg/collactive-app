import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleInformationComponent } from './lifestyle-information.component';

describe('LifestyleInformationComponent', () => {
  let component: LifestyleInformationComponent;
  let fixture: ComponentFixture<LifestyleInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifestyleInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifestyleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
