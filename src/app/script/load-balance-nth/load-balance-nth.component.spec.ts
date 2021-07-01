import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBalanceNthComponent } from './load-balance-nth.component';

describe('LoadBalanceNthComponent', () => {
  let component: LoadBalanceNthComponent;
  let fixture: ComponentFixture<LoadBalanceNthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadBalanceNthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadBalanceNthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
