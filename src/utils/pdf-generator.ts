import { jsPDF } from 'jspdf';
import { BusinessType, BusinessVariant } from '@/types/business';

export const generatePDF = (business: BusinessType, variant: BusinessVariant, budget: number, variantType: 'online' | 'physical' | 'b2b') => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Helper function to check if we need a new page
    const checkNewPage = (additionalHeight: number) => {
      if (yPosition + additionalHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(28);
    doc.setTextColor(0, 102, 204); // Primary color
    doc.text('MarketMap', margin, yPosition);
    yPosition += 12;

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text(`${business.name} Marketing Platform Map`, margin, yPosition);
    yPosition += 8;

    // Business details
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Business Model: ${variantType.charAt(0).toUpperCase() + variantType.slice(1)}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Monthly Budget: $${budget.toLocaleString()}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // HERO CHANNEL SECTION
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text('🎯 PRIMARY CHANNEL (Your Core Focus)', margin, yPosition);
    yPosition += 10;

    const heroAllocation = Math.round(budget * (variant.budget_allocation.hero_channel_pct / 100));

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(variant.hero_channel.platform, margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const heroLines = doc.splitTextToSize(`Why it works: ${variant.hero_channel.why_it_works}`, contentWidth - 5);
    doc.text(heroLines, margin + 5, yPosition);
    yPosition += heroLines.length * 5 + 5;

    // Hero metrics in grid
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const metrics = [
      `Cost per Acquisition (CAC): ${variant.hero_channel.cac_range}`,
      `Conversion Rate: ${variant.hero_channel.conversion_rate}`,
      `Budget Allocation: $${heroAllocation.toLocaleString()} (${variant.budget_allocation.hero_channel_pct}%)`
    ];
    metrics.forEach(metric => {
      doc.text(`• ${metric}`, margin + 5, yPosition);
      yPosition += 5;
    });

    if (variant.hero_channel.time_to_lead) {
      doc.text(`• Time to Lead: ${variant.hero_channel.time_to_lead}`, margin + 5, yPosition);
      yPosition += 5;
    }

    yPosition += 5;
    checkNewPage(20);

    // SUPPORT CHANNELS SECTION
    if (variant.support_channels && variant.support_channels.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('📱 SUPPORT CHANNELS', margin, yPosition);
      yPosition += 10;

      const supportAllocation = Math.round(budget * (variant.budget_allocation.support_channels_pct / 100));

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Budget: $${supportAllocation.toLocaleString()} (${variant.budget_allocation.support_channels_pct}%)`, margin, yPosition);
      yPosition += 6;
      doc.text(variant.budget_allocation.support_channels_detail, margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      variant.support_channels.slice(0, 5).forEach((channel) => {
        checkNewPage(12);
        doc.text(`• ${channel.platform}`, margin + 5, yPosition);
        yPosition += 5;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`  CAC: ${channel.cac_range} | Conversion: ${channel.conversion_rate}`, margin + 10, yPosition);
        yPosition += 5;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      });

      yPosition += 5;
      checkNewPage(20);
    }

    // HIDDEN GOLDMINES SECTION
    if (variant.hidden_goldmines && variant.hidden_goldmines.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('💎 HIDDEN GOLDMINES', margin, yPosition);
      yPosition += 10;

      const goldminesAllocation = Math.round(budget * (variant.budget_allocation.goldmines_pct / 100));

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Budget: $${goldminesAllocation.toLocaleString()} (${variant.budget_allocation.goldmines_pct}%)`, margin, yPosition);
      yPosition += 6;
      doc.text(variant.budget_allocation.goldmines_detail, margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      variant.hidden_goldmines.slice(0, 5).forEach((goldmine) => {
        checkNewPage(18);
        doc.text(`• ${goldmine.platform}`, margin + 5, yPosition);
        yPosition += 5;

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`CAC: ${goldmine.cac_range}`, margin + 10, yPosition);
        yPosition += 5;

        const whyLines = doc.splitTextToSize(`Why valuable: ${goldmine.why_valuable}`, contentWidth - 10);
        doc.text(whyLines, margin + 10, yPosition);
        yPosition += whyLines.length * 4 + 3;

        const howLines = doc.splitTextToSize(`How to use: ${goldmine.how_to_use}`, contentWidth - 10);
        doc.text(howLines, margin + 10, yPosition);
        yPosition += howLines.length * 4 + 5;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      });

      yPosition += 5;
      checkNewPage(30);
    }

    // AUDIENCE LOCATIONS
    if (variant.audience_locations) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('🎯 WHERE YOUR AUDIENCE HANGS OUT', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (variant.audience_locations.online_communities && variant.audience_locations.online_communities.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(0, 102, 204);
        doc.text('Online Communities:', margin, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        variant.audience_locations.online_communities.forEach(community => {
          doc.text(`• ${community}`, margin + 5, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      if (variant.audience_locations.offline_locations && variant.audience_locations.offline_locations.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(0, 102, 204);
        doc.text('Offline Locations:', margin, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        variant.audience_locations.offline_locations.forEach(location => {
          doc.text(`• ${location}`, margin + 5, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      if (variant.audience_locations.search_behavior && variant.audience_locations.search_behavior.length > 0) {
        checkNewPage(20);
        doc.setFontSize(11);
        doc.setTextColor(0, 102, 204);
        doc.text('Search Behavior:', margin, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        variant.audience_locations.search_behavior.slice(0, 5).forEach(behavior => {
          doc.text(`• ${behavior}`, margin + 5, yPosition);
          yPosition += 4;
        });
      }

      yPosition += 10;
    }

    // BUDGET BREAKDOWN SUMMARY
    checkNewPage(50);
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    doc.text('BUDGET ALLOCATION SUMMARY', margin, yPosition);
    yPosition += 12;

    const heroAlloc = Math.round(budget * (variant.budget_allocation.hero_channel_pct / 100));
    const supportAlloc = Math.round(budget * (variant.budget_allocation.support_channels_pct / 100));
    const goldminesAlloc = Math.round(budget * (variant.budget_allocation.goldmines_pct / 100));

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const allocations = [
      { label: 'Hero Channel', amount: heroAlloc, pct: variant.budget_allocation.hero_channel_pct },
      { label: 'Support Channels', amount: supportAlloc, pct: variant.budget_allocation.support_channels_pct },
      { label: 'Hidden Goldmines', amount: goldminesAlloc, pct: variant.budget_allocation.goldmines_pct }
    ];

    allocations.forEach(alloc => {
      doc.text(`${alloc.label}: $${alloc.amount.toLocaleString()} (${alloc.pct}%)`, margin, yPosition);
      yPosition += 7;
    });

    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204);
    doc.text(`Total Monthly Budget: $${budget.toLocaleString()}`, margin, yPosition);

    // Footer
    yPosition = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
    doc.text('Generated by MarketMap • marketmap.cloud', margin, yPosition);

    return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

export const downloadPDF = (doc: jsPDF, businessName: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${businessName.replace(/\s+/g, '_')}_MarketingPlan_${timestamp}.pdf`;
  doc.save(filename);
};
