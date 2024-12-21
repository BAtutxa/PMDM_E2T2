import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {

  // Variable para almacenar el texto del informe
  informeText: string = '';

  constructor() { }

  // Método para generar el PDF con el contenido del informe
  generatePDF() {
    const doc = new jsPDF();
    
    // Establecer un título con un estilo más grande y negrita
    doc.setFontSize(22);  // Tamaño de fuente para el título
    doc.setFont('helvetica', 'bold');  // Fuente en negrita
    doc.text('Informe altamente insano', 10, 10);
    
    // Volver a un tamaño de fuente normal para el contenido del informe
    doc.setFontSize(12);  // Tamaño de fuente para el contenido
    doc.setFont('helvetica', 'normal');  // Fuente normal

    // Usar splitTextToSize para manejar textos largos y ajustarlos al ancho de la página
    const yPosition = 20; // La posición inicial para el contenido del informe
    const maxWidth = 180; // El ancho máximo para el texto (menos márgenes)
    
    // Dividir el texto en líneas que quepan dentro del ancho máximo
    const textLines = doc.splitTextToSize(this.informeText, maxWidth);

    // Agregar el contenido del informe al PDF
    doc.text(textLines, 10, yPosition);

    // Guardar el PDF generado
    doc.save('informe.pdf');
  }

  ngOnInit() {
  }

}
