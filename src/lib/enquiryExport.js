// CSV / Excel / PDF generation for the admin "Enquiry Report" export buttons.
// Rows are pre-normalized by the caller to:
//   { name, company, email, phone, product, quantity, message, date, status, source }

export const EXPORT_COLUMNS = [
  { key: "name", label: "Name", width: 22 },
  { key: "company", label: "Company", width: 26 },
  { key: "email", label: "Email", width: 28 },
  { key: "phone", label: "Phone", width: 14 },
  { key: "product", label: "Product", width: 34 },
  { key: "quantity", label: "Quantity", width: 12 },
  { key: "message", label: "Message", width: 40 },
  { key: "date", label: "Date", width: 14 },
  { key: "status", label: "Status", width: 14 },
  { key: "source", label: "Source", width: 20 },
];

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows) {
  const header = EXPORT_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((row) =>
    EXPORT_COLUMNS.map((c) => csvEscape(row[c.key])).join(",")
  );
  // UTF-8 BOM so Excel opens special characters (₹, accented names, etc.) correctly.
  return "﻿" + [header, ...lines].join("\r\n");
}

export async function toXlsxBuffer(rows, sheetName = "Enquiries") {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = EXPORT_COLUMNS.map((c) => ({ header: c.label, key: c.key, width: c.width }));
  sheet.getRow(1).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));

  return workbook.xlsx.writeBuffer();
}

export async function toPdfBuffer(rows, title = "Enquiry Report") {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 841.89; // A4 landscape
  const PAGE_HEIGHT = 595.28;
  const MARGIN = 30;
  const ROW_HEIGHT = 16;
  const FONT_SIZE = 8;
  const TITLE_SIZE = 14;

  // Scale column widths (defined in "chars") down to fit the printable width.
  const totalWidthUnits = EXPORT_COLUMNS.reduce((sum, c) => sum + c.width, 0);
  const printableWidth = PAGE_WIDTH - MARGIN * 2;
  const columnWidths = EXPORT_COLUMNS.map((c) => (c.width / totalWidthUnits) * printableWidth);

  function truncate(text, maxChars) {
    const s = text == null ? "" : String(text);
    return s.length > maxChars ? s.slice(0, maxChars - 1) + "…" : s;
  }

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function drawHeader() {
    page.drawText(title, { x: MARGIN, y, size: TITLE_SIZE, font: boldFont, color: rgb(0.04, 0.12, 0.27) });
    y -= TITLE_SIZE + 4;
    page.drawText(`Generated ${new Date().toLocaleString("en-IN")}`, {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    y -= 20;
    drawRow(EXPORT_COLUMNS.map((c) => c.label), boldFont);
  }

  function drawRow(cells, useFont) {
    let x = MARGIN;
    cells.forEach((cell, i) => {
      const maxChars = Math.floor(columnWidths[i] / (FONT_SIZE * 0.55));
      page.drawText(truncate(cell, maxChars), {
        x,
        y,
        size: FONT_SIZE,
        font: useFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      x += columnWidths[i];
    });
    y -= ROW_HEIGHT;
  }

  drawHeader();

  for (const row of rows) {
    if (y < MARGIN + ROW_HEIGHT) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
      drawHeader();
    }
    drawRow(
      EXPORT_COLUMNS.map((c) => row[c.key]),
      font
    );
  }

  if (rows.length === 0) {
    page.drawText("No enquiries found.", { x: MARGIN, y, size: FONT_SIZE + 2, font, color: rgb(0.4, 0.4, 0.4) });
  }

  return doc.save();
}
