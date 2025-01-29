import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasDelDiaPage } from './citas-del-dia.page';

describe('CitasDelDiaPage', () => {
  let component: CitasDelDiaPage;
  let fixture: ComponentFixture<CitasDelDiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasDelDiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
