import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSetupComponent } from './type-setup.component';

describe('TypeSetupComponent', () => {
  let component: TypeSetupComponent;
  let fixture: ComponentFixture<TypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
