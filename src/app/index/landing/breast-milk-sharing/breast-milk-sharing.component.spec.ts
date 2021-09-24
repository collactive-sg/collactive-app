import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreastMilkSharingComponent } from './breast-milk-sharing.component';

describe('BreastMilkSharingComponent', () => {
  let component: BreastMilkSharingComponent;
  let fixture: ComponentFixture<BreastMilkSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreastMilkSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreastMilkSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
