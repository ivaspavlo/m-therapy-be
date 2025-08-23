import { IAdminNotificationEmail, IEmailTemplate } from '../../interfaces';

export const GetAdminNotificationTemplate = (templateData: IEmailTemplate<IAdminNotificationEmail>) => {
  

  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    to: templateData.to,
    subject: templateData.subject,
    html: buildTemplate(templateData)
  };
}

const buildTemplate = (templateData: IEmailTemplate<IAdminNotificationEmail>): string => {
  return '';
}
