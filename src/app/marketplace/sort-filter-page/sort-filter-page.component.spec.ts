import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFilterPageComponent } from './sort-filter-page.component';

describe('SortFilterPageComponent', () => {
  let component: SortFilterPageComponent;
  let fixture: ComponentFixture<SortFilterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortFilterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
