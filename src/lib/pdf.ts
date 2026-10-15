/**
 * PDF built in the browser with jsPDF (loaded only when the visitor asks for it). Vector text,
 * no watermark, nothing uploaded: the file is made on the visitor's device and saved by it.
 * Letter size for the US and Canada, A4 for the UK and Australia.
 */
import type { DocView } from './doc-view';

// jsPDF's standard fonts use WinAnsi: replace the few characters outside it.
const clean = (s: string) => s.replace(/−/g, '-').replace(/[   ]/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\xff€£¥]/g, '?');

function hexRgb(h: string): [number, number, number] { const x = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16)) as [number, number, number]; }

export async function makePdf(v: DocView, opts: { paper: 'a4' | 'letter'; logo?: string; accent?: string; fileName: string }): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: opts.paper, compress: true });
  doc.setProperties({ title: clean(v.footer), creator: 'taxinvoicemaker.com (generated in the browser)' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
  const M = 48, right = W - M;
  const accent = hexRgb(opts.accent ?? '#0E5A4A');
  let y = M;

  const text = (s: string, x: number, yy: number, o: { size?: number; bold?: boolean; color?: [number, number, number]; align?: 'left' | 'right' | 'center' } = {}) => {
    doc.setFont('helvetica', o.bold ? 'bold' : 'normal'); doc.setFontSize(o.size ?? 9.5); doc.setTextColor(...(o.color ?? [23, 23, 23]));
    doc.text(clean(s), x, yy, { align: o.align ?? 'left' });
  };
  const wrap = (s: string, width: number, size = 9.5) => { doc.setFontSize(size); return doc.splitTextToSize(clean(s), width) as string[]; };
  const newPageIfNeeded = (need: number) => { if (y + need > H - M) { doc.addPage(); y = M; } };

  doc.setFillColor(...accent); doc.rect(0, 0, W, 6, 'F');

  // Seller (left) and title block (right)
  let ly = y;
  if (opts.logo) {
    try {
      const props = doc.getImageProperties(opts.logo);
      const k = Math.min(150 / props.width, 40 / props.height);
      const w = props.width * k, h = props.height * k;
      doc.addImage(opts.logo, props.fileType, M, ly, w, h);
      ly += h + 8;
    } catch { /* unreadable image: ignored */ }
  }
  v.sellerLines.forEach((l, i) => { text(l, M, ly + 10, { bold: i === 0, size: i === 0 ? 11 : 9.5, color: i === 0 ? [23, 23, 23] : [82, 82, 82] }); ly += i === 0 ? 14 : 12; });
  v.sellerIds.forEach((l) => { text(l, M, ly + 10, { color: [82, 82, 82] }); ly += 12; });

  let ry = y + 18;
  text(v.title.toUpperCase(), right, ry, { size: 20, bold: true, color: accent, align: 'right' });
  ry += 20;
  for (const [k, x] of v.meta) { text(k, right - 130, ry, { color: [115, 115, 115], align: 'right' }); text(x, right, ry, { bold: true, align: 'right' }); ry += 13; }
  y = Math.max(ly, ry) + 16;

  text(v.buyerTitle.toUpperCase(), M, y, { size: 8, bold: true, color: [115, 115, 115] }); y += 13;
  v.buyerLines.forEach((l, i) => { text(l, M, y, { bold: i === 0 }); y += 12; });
  y += 14;

  // Items table
  const cols = v.showTaxCol ? { qty: right - 250, price: right - 175, tax: right - 92, amount: right } : { qty: right - 200, price: right - 100, tax: 0, amount: right };
  const descW = cols.qty - M - 50;
  doc.setDrawColor(...accent); doc.setLineWidth(1.5);
  text(v.head.desc, M, y, { bold: true }); text(v.head.qty, cols.qty, y, { bold: true, align: 'right' }); text(v.head.price, cols.price, y, { bold: true, align: 'right' });
  if (v.showTaxCol) text(v.head.tax, cols.tax, y, { bold: true, align: 'right' });
  text(v.head.amount, cols.amount, y, { bold: true, align: 'right' });
  y += 6; doc.line(M, y, right, y); y += 13;
  doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.5);
  for (const r of v.rows) {
    const lines = wrap(r.desc || ' ', descW);
    newPageIfNeeded(lines.length * 12 + 8);
    lines.forEach((l, i) => text(l, M, y + i * 12));
    text(r.qty, cols.qty, y, { align: 'right' }); text(r.price, cols.price, y, { align: 'right' });
    if (v.showTaxCol) text(r.tax, cols.tax, y, { align: 'right', color: [82, 82, 82] });
    text(r.amount, cols.amount, y, { align: 'right' });
    y += lines.length * 12 + 2; doc.line(M, y, right, y); y += 12;
  }

  // Totals
  y += 4;
  for (const t of v.totals) {
    newPageIfNeeded(16);
    if (t.strong) { y += 3; doc.setDrawColor(160, 160, 160); doc.line(right - 250, y - 12, right, y - 12); }
    const lab = wrap(t.label, 170, t.strong ? 10.5 : 9.5);
    lab.forEach((l, i) => text(l, right - 250, y + i * 11, { bold: t.strong, size: t.strong ? 10.5 : 9.5, color: t.strong ? [23, 23, 23] : [82, 82, 82] }));
    text(t.value, right, y, { bold: t.strong, size: t.strong ? 10.5 : 9.5, align: 'right' });
    y += Math.max(lab.length * 11, 12) + 3;
  }

  const block = (heading: string | null, body: string, bar = false) => {
    if (!body.trim()) return;
    const lines = body.split('\n').flatMap((p) => wrap(p, right - M - 12));
    newPageIfNeeded(lines.length * 12 + 24);
    y += 12;
    if (heading) { text(heading.toUpperCase(), M, y, { size: 8, bold: true, color: [115, 115, 115] }); y += 13; }
    const top = y - 9;
    lines.forEach((l) => { text(l, bar ? M + 10 : M, y, { bold: bar }); y += 12; });
    if (bar) { doc.setDrawColor(...accent); doc.setLineWidth(2); doc.line(M, top, M, y - 9); doc.setLineWidth(0.5); }
  };
  if (v.statements.length) block(null, v.statements.join('\n'), true);
  block('Payment details', v.payment);
  block(null, v.notes);

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    text(`${v.footer}${pages > 1 ? `  ·  page ${i} of ${pages}` : ''}`, W / 2, H - 24, { size: 8, color: [150, 150, 150], align: 'center' });
  }
  doc.save(opts.fileName);
}
