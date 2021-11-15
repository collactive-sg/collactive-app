import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortPageComponent } from './sort-page.component';

describe('SortPageComponent', () => {
  let component: SortPageComponent;
  let fixture: ComponentFixture<SortPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
