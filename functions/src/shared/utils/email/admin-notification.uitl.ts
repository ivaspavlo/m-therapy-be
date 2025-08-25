import { IAdminNotificationEmail } from '../../interfaces';

export const GetAdminNotificationTemplate = (templateData: IAdminNotificationEmail) => {
  

  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    subject: 'Запит на підтвердження замовлення',
    to: templateData.adminEmailAddress,
    html: buildTemplate(templateData)
  };
}

const buildTemplate = (templateData: IAdminNotificationEmail): string => {
  return JSON.stringify(templateData);
}
