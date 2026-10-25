import { Itinerary } from '../types/itinerary';

/**
 * Initiates high-fidelity browser PDF generation with pre-configured
 * document title so the saved file automatically adopts the quotation code and client name.
 */
export function exportQuotationAsPDF(itinerary: Itinerary) {
  const originalTitle = document.title;
  const sanitizedClient = itinerary.clientName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${itinerary.code}_${sanitizedClient}_ROYAL_TOURS_Quotation`;

  document.title = filename;

  // Let DOM update title before triggering print dialog
  setTimeout(() => {
    window.print();

    // Restore original page title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  }, 100);
}

/**
 * Generates an offline, standalone self-contained luxury document file (.html)
 * that opens in any browser and can be converted to PDF with 1-click.
 */
export function downloadOfflineQuotationHTML(itinerary: Itinerary) {
  const sanitizedClient = itinerary.clientName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${itinerary.code}_${sanitizedClient}_ROYAL_TOURS.html`;

  const totalCalculated = itinerary.pricingSlots.reduce(
    (sum, slot) => sum + slot.price,
    0
  );
  const currency = itinerary.currency || '₹';

  const daysHtml = [
    ...(itinerary.hasDay0 && itinerary.day0
      ? [
          `<div style="margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
            <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
              <strong style="color:#0f172a;"><span style="background:#e2e8f0; padding:2px 8px; border-radius:4px; font-family:monospace; margin-right:8px;">DAY 0</span> ${itinerary.day0.title}</strong>
              <span style="font-family:monospace; color:#64748b; font-size:12px;">${itinerary.day0.date || itinerary.dateOfTravel}</span>
            </div>
            <p style="font-size:13px; color:#334155; line-height:1.6; margin:0;">${itinerary.day0.activities}</p>
            ${itinerary.day0.enableNotes && itinerary.day0.notes ? `<p style="font-size:12px; color:#475569; background:#ffffff; border:1px solid #e2e8f0; padding:8px; border-radius:6px; margin-top:8px;"><strong>Note:</strong> ${itinerary.day0.notes}</p>` : ''}
          </div>`,
        ]
      : []),
    ...itinerary.days.map(
      (day) =>
        `<div style="margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #ffffff;">
          <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 8px;">
            <strong style="color:#0f172a;"><span style="background:#0f172a; color:#fff; padding:2px 8px; border-radius:4px; font-family:monospace; margin-right:8px;">DAY ${day.dayNumber}</span> ${day.title}</strong>
            <span style="font-family:monospace; color:#64748b; font-size:12px;">${day.date || ''}</span>
          </div>
          <p style="font-size:13px; color:#334155; line-height:1.6; margin:0;">${day.activities.replace(/\n/g, '<br/>')}</p>
          ${day.enableNotes && day.notes ? `<p style="font-size:12px; color:#475569; background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; margin-top:8px;"><strong>Note:</strong> ${day.notes}</p>` : ''}
        </div>`
    ),
  ].join('');

  const inclusionsHtml = itinerary.inclusions
    .map((inc) => `<li style="margin-bottom:6px; color:#334155;">✓ ${inc}</li>`)
    .join('');

  const exclusionsHtml = itinerary.exclusions
    .map((exc) => `<li style="margin-bottom:6px; color:#334155;">✕ ${exc}</li>`)
    .join('');

  const pricingRowsHtml = itinerary.pricingSlots
    .map(
      (slot) =>
        `<tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:10px 14px; font-weight:500; color:#0f172a;">${slot.label}</td>
          <td style="padding:10px 14px; text-align:center; font-family:monospace; color:#475569;">${slot.unit}</td>
          <td style="padding:10px 14px; text-align:right; font-family:monospace; font-weight:700; color:#0f172a;">${currency} ${slot.price.toLocaleString('en-IN')}</td>
        </tr>`
    )
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${itinerary.code} - ${itinerary.clientName} - ROYAL TOURS</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 30px 20px;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
    }
    .print-bar {
      max-width: 820px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .btn:hover { background: #1e293b; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
      .print-bar { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-size:12px; color:#64748b; font-family:monospace;">ROYAL TOURS BESPOKE EXPEDITION QUOTATION</div>
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="container">
    <!-- Header with 1st Uploaded Photo Logo & 2nd Uploaded Photo Email Card -->
    <div style="border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 20px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px; flex-wrap:wrap;">
        <div style="background:#000000; border-radius:12px; padding:12px 24px; text-align:center; border:1px solid #ca8a04;">
          <div style="font-family:system-ui, -apple-system, sans-serif; font-size:26px; font-weight:900; letter-spacing:2px; color:#facc15; line-height:1.1;">
            ROYAL T<span style="border-top:3px solid #facc15; border-radius:3px 3px 0 0; padding-top:2px;">O</span>URS
          </div>
          <div style="font-family:'Cinzel', serif; font-size:9px; letter-spacing:2px; color:#ffffff; font-weight:700; margin-top:4px;">
            TRAVEL IN LUXURY, EXPLORE IN STYLE
          </div>
        </div>

        <div style="text-align:right;">
          <div style="display:inline-block; background:#0f172a; color:#ffffff; font-size:10px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; padding:3px 8px; border-radius:4px; margin-bottom:4px;">
            OFFICIAL BESPOKE QUOTATION
          </div>
          <div style="font-family:monospace; font-size:15px; font-weight:bold; color:#0f172a;">${itinerary.code}</div>
          <div style="font-size:11px; color:#64748b; margin-top:3px;">Date: <strong>${itinerary.quotationDate}</strong></div>
          <div style="font-size:11px; color:#64748b;">Valid Until: <strong>${itinerary.validUntil || '14 Days'}</strong></div>
        </div>
      </div>

      <!-- Verified Email Card matching 2nd photo + Phone & Instagram -->
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:#00796b; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:16px;">
            R
          </div>
          <div>
            <div style="font-size:12px; font-weight:bold; color:#0f172a; line-height:1.1;">Royal Tours</div>
            <div style="font-size:11px; color:#475569;">royaltoursofficial@gmail.com</div>
          </div>
        </div>

        <div style="font-family:monospace; font-size:11px; color:#334155; text-align:right;">
          <div><strong>Phone:</strong> 8248886319</div>
          <div><strong>Instagram:</strong> @royaltoursofficial</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:25px;">
      <div>
        <div style="font-size:10px; font-weight:bold; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">CLIENT INFORMATION</div>
        <div style="font-size:15px; font-weight:bold; color:#0f172a;">${itinerary.clientName}</div>
        <div style="font-size:12px; color:#475569; font-family:monospace; margin-top:4px;">${itinerary.clientNumber}</div>
        ${itinerary.clientEmail ? `<div style="font-size:12px; color:#475569; font-family:monospace;">${itinerary.clientEmail}</div>` : ''}
      </div>
      <div style="border-left:1px solid #e2e8f0; padding-left:20px;">
        <div style="font-size:10px; font-weight:bold; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">CURATED BY EXPEDITION LEAD</div>
        <div style="font-size:15px; font-weight:bold; color:#0f172a;">${itinerary.consultant.name}</div>
        <div style="font-size:12px; color:#475569;">${itinerary.consultant.role}</div>
        <div style="font-size:12px; color:#475569; font-family:monospace; margin-top:4px;">${itinerary.consultant.phone} · ${itinerary.consultant.email}</div>
      </div>
    </div>

    <div style="margin-bottom:25px;">
      <h3 style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:12px;">Expedition Overview</h3>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
        <div><span style="font-size:10px; color:#94a3b8; text-transform:uppercase; display:block;">Destination</span><strong style="font-size:12px; color:#0f172a;">${itinerary.destination}</strong></div>
        <div><span style="font-size:10px; color:#94a3b8; text-transform:uppercase; display:block;">Duration</span><strong style="font-size:12px; color:#0f172a; font-family:monospace;">${itinerary.duration}</strong></div>
        <div><span style="font-size:10px; color:#94a3b8; text-transform:uppercase; display:block;">Travel Date</span><strong style="font-size:12px; color:#0f172a; font-family:monospace;">${itinerary.dateOfTravel}</strong></div>
        <div><span style="font-size:10px; color:#94a3b8; text-transform:uppercase; display:block;">Pax</span><strong style="font-size:12px; color:#0f172a;">${itinerary.groupSizePax}</strong></div>
      </div>
      ${itinerary.transportDetails ? `<div style="font-size:12px; color:#334155; margin-top:8px; padding:10px 14px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;"><strong>Private Logistics & Transport:</strong> ${itinerary.transportDetails}</div>` : ''}
    </div>

    <div style="margin-bottom:25px;">
      <h3 style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:12px;">Day-by-Day Expedition Itinerary</h3>
      ${daysHtml}
    </div>

    <div style="margin-bottom:25px;">
      <h3 style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:12px;">Commercial Costing Breakdown</h3>
      <table style="width:100%; border-collapse:collapse; font-size:13px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <thead>
          <tr style="background:#f1f5f9; color:#475569; font-size:11px; text-transform:uppercase;">
            <th style="padding:10px 14px; text-align:left;">Package Tier / Excursion Specification</th>
            <th style="padding:10px 14px; text-align:center;">Pricing Unit</th>
            <th style="padding:10px 14px; text-align:right;">Estimate Amount</th>
          </tr>
        </thead>
        <tbody>
          ${pricingRowsHtml}
          <tr style="background:#f8fafc; font-weight:bold; border-top:2px solid #cbd5e1;">
            <td style="padding:12px 14px; text-transform:uppercase; font-size:12px;">Total Package Estimate</td>
            <td style="padding:12px 14px; text-align:center; color:#64748b; font-size:11px;">Combined Total</td>
            <td style="padding:12px 14px; text-align:right; font-size:16px; font-family:monospace; color:#0f172a;">${currency} ${totalCalculated.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      ${itinerary.costingNote ? `<p style="font-size:11px; color:#64748b; font-style:italic; margin-top:8px;">* ${itinerary.costingNote}</p>` : ''}
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:25px;">
      <div style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#f8fafc;">
        <h4 style="font-size:12px; text-transform:uppercase; color:#0f172a; margin-top:0; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">Inclusions</h4>
        <ul style="list-style:none; padding:0; margin:0; font-size:12px; line-height:1.6;">${inclusionsHtml}</ul>
      </div>
      <div style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#f8fafc;">
        <h4 style="font-size:12px; text-transform:uppercase; color:#0f172a; margin-top:0; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">Exclusions</h4>
        <ul style="list-style:none; padding:0; margin:0; font-size:12px; line-height:1.6;">${exclusionsHtml}</ul>
      </div>
    </div>

    <div style="border:1px solid #e2e8f0; border-radius:10px; padding:16px; background:#f8fafc; font-size:12px; color:#475569; margin-bottom:25px;">
      <strong style="color:#0f172a; display:block; margin-bottom:6px;">Expedition Policies & Cancellation Guarantees</strong>
      <p style="margin:0 0 6px 0;">A 50% deposit confirms private aircraft and wilderness permits. Balance due 15 days prior. Cancellations 30+ days prior qualify for an 80% refund or 100% atelier credit.</p>
      <p style="margin:0; font-size:11px; color:#64748b;">${itinerary.expeditionSafetyTerms || itinerary.cancellationPolicy || ''}</p>
    </div>

    <div style="border-top:2px solid #0f172a; padding-top:20px; display:flex; justify-content:space-between; align-items:flex-end;">
      <div>
        <strong style="font-family:'Cinzel', serif; font-size:13px; text-transform:uppercase;">ROYAL TOURS ATELIER</strong>
        <div style="font-size:11px; color:#64748b; font-family:monospace;">royaltoursofficial@gmail.com · Ph: 8248886319 · Instagram: @royaltoursofficial</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:14px; font-style:italic; font-family:serif; color:#334155;">${itinerary.consultant.name}</div>
        <div style="border-top:1px solid #94a3b8; width:160px; margin-top:4px; padding-top:2px; font-size:11px; font-weight:bold;">${itinerary.consultant.name}</div>
        <div style="font-size:10px; color:#64748b;">${itinerary.consultant.role}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
