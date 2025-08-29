import { IAdminNotificationEmail } from '../../interfaces';

export const GetAdminNotificationTemplate = (templateData: IAdminNotificationEmail) => {
  

  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    subject: 'Підтвердження замовлення',
    to: templateData.adminEmailAddress,
    html: buildTemplate(templateData)
  };
}

const buildTemplate = (templateData: IAdminNotificationEmail): string => {
  return JSON.stringify(templateData);
}

export function renderBookingSlotsEmail(slots: any[]): string {
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

