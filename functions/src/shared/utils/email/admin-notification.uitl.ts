import { IAdminNotificationEmail } from '../../interfaces';

export const GetAdminNotificationTemplate = (templateData: IAdminNotificationEmail) => {
  const slotsWithProductData = templateData.bookings.map((b) => {
    const product = templateData.products.find(p => p.id === b.productId);
    return {
      ...b,
      productName: product?.name || '',
      productPrice: product?.price || ''
    }
  });

  const bookingSlotsDataHtml = renderBookingSlotsForEmail(slotsWithProductData);

  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    subject: 'Підтвердження замовлення',
    to: templateData.adminEmailAddress,
    html: buildTemplate(templateData, bookingSlotsDataHtml)
  };
}

const buildTemplate = (templateData: IAdminNotificationEmail, bookingSlotsDataHtml: string): string => {
  console.log(templateData, bookingSlotsDataHtml);
  return '';
}

export function renderBookingSlotsForEmail(slots: any[]): string {
  if (!slots || slots.length === 0) {
    return '<p>No booking slots available.</p>';
  }

  const listItems = slots
    .map(
      (slot) => `
        <li>
          <strong>${slot.productName}</strong><br/>
          Price: €${slot.productPrice.toFixed(2)}<br/>
          From: ${new Date(slot.start).toLocaleString('de-AT')}<br/>
          To: ${new Date(slot.end).toLocaleString('de-AT')}<br/>
          Status: ${slot.isBooked ? 'Booked' : 'Available'}
        </li>
      `
    ).join('');

  return `
    <ul>
      ${listItems}
    </ul>
  `;
}

