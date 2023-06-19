import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEpicComponent } from './generate-epic.component';

describe('GenerateEpicComponent', () => {
  let component: GenerateEpicComponent;
  let fixture: ComponentFixture<GenerateEpicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateEpicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateEpicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
