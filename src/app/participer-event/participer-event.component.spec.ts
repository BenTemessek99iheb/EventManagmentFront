import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticiperEventComponent } from './participer-event.component';

describe('ParticiperEventComponent', () => {
  let component: ParticiperEventComponent;
  let fixture: ComponentFixture<ParticiperEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticiperEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticiperEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
