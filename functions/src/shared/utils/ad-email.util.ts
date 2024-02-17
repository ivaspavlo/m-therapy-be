export const GetAdTemplate = (config: any) => {
  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    to: config.to,
    subject: config.subject,
    html: buildTemplate(config)
  };
}

export const buildTemplate = (config: any): string => {
  return '';
}
