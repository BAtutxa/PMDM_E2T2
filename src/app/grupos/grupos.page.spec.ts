import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GruposPage } from './grupos.page';

describe('GruposPage', () => {
  let component: GruposPage;
  let fixture: ComponentFixture<GruposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new group', () => {
    const initialGroupsCount = component.grupos.length;
    component.crearGrupo();
    expect(component.grupos.length).toBe(initialGroupsCount + 1);
  });

  it('should edit a group', () => {
    const initialName = component.grupos[0].nombre;
    component.editarGrupo(0);
    expect(component.grupos[0].nombre).not.toBe(initialName);
  });

  it('should delete a group', () => {
    const initialGroupsCount = component.grupos.length;
    component.eliminarGrupo(0);
    expect(component.grupos.length).toBe(initialGroupsCount - 1);
  });
});
