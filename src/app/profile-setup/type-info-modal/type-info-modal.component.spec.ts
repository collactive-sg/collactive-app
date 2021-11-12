import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeInfoModalComponent } from './type-info-modal.component';

describe('TypeInfoModalComponent', () => {
  let component: TypeInfoModalComponent;
  let fixture: ComponentFixture<TypeInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
