import { IAdEmail, IEmailTemplate } from '../../interfaces';


export const GetAdTemplate = (templateData: IEmailTemplate<IAdEmail>) => {
  return {
    from: 'Tkachuk Massage Therapy <tkachuk_massage_therapy@gmail.com>',
    to: templateData.to,
    subject: templateData.subject,
    html: buildTemplate(templateData)
  };
}

const buildTemplate = (templateData: IEmailTemplate<IAdEmail>): string => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head> </head>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" /><!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
      <style type="text/css">
        * {
          text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }

        html {
          height: 100%;
          width: 100%;
        }

        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          mso-line-height-rule: exactly;
        }

        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }

        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }

        .ReadMsgBody,
        .ExternalClass {
          width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
      </style><!--[if gte mso 9]>
        <style type="text/css">
        li { text-indent: -1em; }
        table td { border-collapse: collapse; }
        </style>
        <![endif]-->
      <title> </title>
      <!-- content -->
      <!--[if gte mso 9]><xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml><![endif]-->
    </head>
    <body class="body" style="background-color: #EEEEEE; margin: 0; width: 100%;">
      <table class="bodyTable" role="presentation" width="100%" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #EEEEEE; margin: 0;" bgcolor="#EEEEEE">
        <tr>
          <td class="body__content" align="left" width="100%" valign="top" style="color: #000000; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px;">
            <div class="container" style="width: 100%; margin: 10px auto; max-width: 700px;"> <!--[if mso | IE]> <table class="container__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style=" margin-right: auto; margin-left: auto;width: 700px" width="700" align="center">
                <tr>
                  <td> <![endif]--> <table class="container__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
                      <tr class="container__row">
                        <td class="container__cell" width="100%" align="left" valign="top" style="background-color: #FFFFFF; border: 1px solid #D2D2D2; padding: 10px 20px;" bgcolor="#FFFFFF">
                          <div class="row">
                            <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                              <tr class="row__row">
                                <td class="column col-sm-12" width="700" style="padding: 0 10px;width: 100%" align="left" valign="top">
                                  <figure class="logo-figure" href="localhost://4200" target="_blank" style="display: inline-block; margin: 0; width: 100%;">
                                    <img class="logo-img img__block" src="https://firebasestorage.googleapis.com/v0/b/mt-stage-db6be.appspot.com/o/mt-logo.png?alt=media&token=995a3cbe-4467-4321-bd40-9d1ea40f0197" alt="Logo" title="Logo" border="0" style="max-width: 100%; width: 175px; display: inline;" width="175" />
                                  </figure>
                                  <h2 id="email-title" class="email-title header h2" style="margin: 20px 0; line-height: 30px; font-family: Helvetica,Arial,sans-serif; text-align: center; color: #044E3B;">${ templateData.title }</h2>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <div class="hr" style="margin: 0 auto; width: 100%;"> <!--[if mso | IE]> <table class="hr__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-right: auto; margin-left: auto; width: 100%;" width="100%" align="center">
                              <tr>
                                <td> <![endif]--> <table class="hr__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr class="hr__row">
                                      <td class="hr__cell" width="100%" align="left" valign="top" style="border-top: 1px solid #9A9A9A; border-color: #DDDDDD;">&nbsp;</td>
                                    </tr>
                                  </table> <!--[if mso | IE]> </td>
                              </tr>
                            </table> <![endif]--> </div>
                          <div class="row">
                            <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                              <tr class="row__row">
                                <td class="column col-sm-12" width="700" style="padding: 0 10px;width: 100%" align="left" valign="top">
                                  <p class="email-message text p" style="display: block; margin: 14px 0; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; color: #044E3B;">${ templateData.message }</p>
                                  <figure class="email-ad-figure" style="display: inline-block; margin: 0 0 16px; position: relative; text-align: center; width: 100%;">
                                    <img class="email-ad-image img__block" src="https://firebasestorage.googleapis.com/v0/b/mt-stage-db6be.appspot.com/o/promo-graphics-5.jpg?alt=media&token=941e1229-ccc4-4abd-a62a-84f0bb33db34" border="0" alt="" style="display: block; max-width: 100%;" />
                                    <figcaption class="email-ad-figcaption" style="border-radius: 6px; bottom: 44px; position: absolute; width: 100%;">
                                      <a href="${ templateData.config.url }" class="email-ad-link a" style="width: 35%; padding: 8px 16px; box-shadow: 0 2px 5px 0 #808080; border-radius: 4px; background: linear-gradient(4.01deg, #059669 3.04%, #36DCA5 96.51%); color: #FFFFFF; display: inline-block;"><span class="a__text" style="color: #FFFFFF;"> ${ templateData.lang === 'en' ? 'Follow the link' : 'Перейти за посиланням' } </span></a>
                                    </figcaption>
                                  </figure>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <div class="hr" style="margin: 0 auto; width: 100%;"> <!--[if mso | IE]> <table class="hr__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-right: auto; margin-left: auto; width: 100%;" width="100%" align="center">
                              <tr>
                                <td> <![endif]--> <table class="hr__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr class="hr__row">
                                      <td class="hr__cell" width="100%" align="left" valign="top" style="border-top: 1px solid #9A9A9A; border-color: #DDDDDD;">&nbsp;</td>
                                    </tr>
                                  </table> <!--[if mso | IE]> </td>
                              </tr>
                            </table> <![endif]--> </div>
                          <div class="row">
                            <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                              <tr class="row__row">
                                <td class="column col-sm-12" width="700" style="padding: 0 10px;width: 100%" align="left" valign="top">
                                  <div class="email-links" style="margin-bottom: 16px;">
                                    <a class="email-unsubscribe a" href="#" style="font-size: 12px; color: #0DB981;"><span class="a__text" style="color: #0DB981;"> ${ templateData.lang === 'en' ? 'Cancel subscription' : 'Відмінити підписку' } </span></a>
                                    <div class="email-social" style="margin-top: 8px;">
                                      <a class="email-social-icon a" href="#" style="width: 30px; height: 30px; border-radius: 4px; display: inline-block;"><span class="a__text">
                                          <img src="https://firebasestorage.googleapis.com/v0/b/mt-stage-db6be.appspot.com/o/telegram.svg?alt=media&token=e19826e8-8bb1-4cf5-b4b3-a9e299f6d603" border="0" alt="" class="img__block" style="display: block; max-width: 100%;" />
                                        </span></a>
                                      <a class="email-social-icon a" href="#" style="width: 30px; height: 30px; border-radius: 4px; display: inline-block;"><span class="a__text">
                                          <img src="https://firebasestorage.googleapis.com/v0/b/mt-stage-db6be.appspot.com/o/viber.svg?alt=media&token=3482860b-5494-49ac-8a20-d3dd6e3d060d" border="0" alt="" class="img__block" style="display: block; max-width: 100%;" />
                                        </span></a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <div class="row">
                            <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                              <tr class="row__row">
                                <td class="column col-sm-12" width="700" style="padding: 0 10px;width: 100%" align="left" valign="top">
                                  <p class="email-footer text p" style="display: block; font-family: Helvetica,Arial,sans-serif; line-height: 20px; padding: 16px 8px; background-color: #F3F4F6; border-radius: 4px; color: #044E3B; font-size: 12px; margin: 0;">&copy; Tkachuk Massage Therapy</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table> <!--[if mso | IE]> </td>
                </tr>
              </table> <![endif]--> </div>
          </td>
        </tr>
      </table>
      <div style="display:none; white-space:nowrap; font-size:15px; line-height:0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
    </body>
  </html>
  `;
}
