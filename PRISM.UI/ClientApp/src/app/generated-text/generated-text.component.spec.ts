import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedTextComponent } from './generated-text.component';

describe('GeneratedTextComponent', () => {
  let component: GeneratedTextComponent;
  let fixture: ComponentFixture<GeneratedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
