import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarCitasPage } from './gestionar-citas.page';

describe('GestionarCitasPage', () => {
  let component: GestionarCitasPage;
  let fixture: ComponentFixture<GestionarCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
