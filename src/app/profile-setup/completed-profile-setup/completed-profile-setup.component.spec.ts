import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedProfileSetupComponent } from './completed-profile-setup.component';

describe('CompletedProfileSetupComponent', () => {
  let component: CompletedProfileSetupComponent;
  let fixture: ComponentFixture<CompletedProfileSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedProfileSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedProfileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
