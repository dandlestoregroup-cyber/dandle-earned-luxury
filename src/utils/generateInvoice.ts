import jsPDF from 'jspdf';

export interface InvoiceData {
  reference: string;
  name: string;
  phone: string;
  address: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const generateInvoice = (data: InvoiceData): Blob => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('DANDLE', 105, 20, { align: 'center' });

  // Invoice details
  doc.setFontSize(14);
  doc.text(`Invoice: ${data.reference}`, 20, 45);

  // Customer information
  doc.setFontSize(10);
  doc.text(`Customer: ${data.name}`, 20, 60);
  doc.text(`Phone: ${data.phone}`, 20, 67);
  doc.text(`Address: ${data.address}`, 20, 74);

  // Items header
  let y = 90;
  doc.text('Item', 20, y);
  doc.text('Qty', 120, y);
  doc.text('Price', 150, y);
  doc.line(20, y + 2, 190, y + 2);

  // Items list
  y += 10;
  data.items.forEach(item => {
    doc.text(item.title, 20, y);
    doc.text(String(item.quantity), 120, y);
    doc.text(`${item.price} EGP`, 150, y);
    y += 8;
  });

  // Total
  doc.line(20, y + 2, 190, y + 2);
  doc.setFontSize(12);
  doc.text(`TOTAL: ${data.total} EGP`, 150, y + 12);

  return doc.output('blob');
};
