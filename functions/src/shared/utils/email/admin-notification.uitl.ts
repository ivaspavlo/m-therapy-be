import { IBookingSlot } from 'src/booking/booking.interface';
import { IAdminNotificationTemplateData } from '../../interfaces';

interface IBookingSlotWithProduct extends IBookingSlot {
  productTitle: string;
  productPrice: number;
}

export const GetAdminNotificationTemplate = (templateData: IAdminNotificationTemplateData) => {
  const slotsWithProductData = templateData.bookings.map((b) => {
    const product = templateData.products.find(p => p.id === b.productId);
    return {
      ...b,
      productTitle: product?.title || '',
      productPrice: product?.price || 0
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

const buildTemplate = (templateData: IAdminNotificationTemplateData, bookingSlotsDataHtml: string): string => {
  console.log(templateData, bookingSlotsDataHtml);
  return '';
}

export function renderBookingSlotsForEmail(slots: IBookingSlotWithProduct[]): string {
  if (!slots || slots.length === 0) {
    return '<p>No booking slots available.</p>';
  }

  const listItems = slots
    .map(
      (slot) => `
        <li>
          <strong>${slot.productTitle}</strong><br/>
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

