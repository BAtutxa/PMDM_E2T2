import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {
  informeText: string = '';
  hitzorduak: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:8080/hitzorduak/hitzorduakGuztiak')
      .subscribe(data => {
        this.hitzorduak = data;
        this.createCharts();
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  createCharts() {
    this.createBarChart();
    this.createPieChart();
    this.createLineChart();
  }

  createBarChart() {
    const ctx = (document.getElementById('barChartCanvas') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.hitzorduak.map(h => h.izena),
        datasets: [{
          label: 'Prezio Totala',
          data: this.hitzorduak.map(h => h.prezio_totala),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createPieChart() {
    const ctx = (document.getElementById('pieChartCanvas') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.hitzorduak.map(h => h.izena),
        datasets: [{
          label: 'Prezio Totala',
          data: this.hitzorduak.map(h => h.prezio_totala),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  createLineChart() {
    const ctx = (document.getElementById('lineChartCanvas') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.hitzorduak.map(h => h.data),
        datasets: [{
          label: 'Evolución de Precios',
          data: this.hitzorduak.map(h => h.prezio_totala),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF();
  
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe con Gráficos', 10, 10);
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const yPosition = 20;
    const maxWidth = 180;
    const textLines = doc.splitTextToSize(this.informeText, maxWidth);
    doc.text(textLines, 10, yPosition);
  
    const charts = [
      { id: 'barChartCanvas', title: 'Gráfico de Barras' },
      { id: 'pieChartCanvas', title: 'Gráfico de Pastel' },
      { id: 'lineChartCanvas', title: 'Gráfico de Líneas' }
    ];
  
    let yOffset = yPosition + textLines.length * 5 + 10; // Ajuste para evitar superposición con el texto
  
    const addChartToPDF = (chartIndex: number) => {
      if (chartIndex >= charts.length) {
        doc.save('informe_con_graficos.pdf');
        return;
      }
  
      const chart = charts[chartIndex];
      const canvasElement = document.getElementById(chart.id) as HTMLCanvasElement;
  
      if (!canvasElement) {
        addChartToPDF(chartIndex + 1);
        return;
      }
  
      html2canvas(canvasElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
  
        if (yOffset + imgHeight > 290) { // Salto de página si es necesario
          doc.addPage();
          yOffset = 10;
        }
  
        doc.setFontSize(16);
        doc.text(chart.title, 10, yOffset);
        yOffset += 8;
        doc.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 10;
  
        addChartToPDF(chartIndex + 1);
      });
    };
  
    addChartToPDF(0);
  }
}