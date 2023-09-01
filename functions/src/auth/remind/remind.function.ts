import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ResponseBody } from '../../shared/models';
import { ERROR_MESSAGES } from '../../shared/constants';
import { IRemind } from './remind.interface';

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'samoran4ez@gmail.com',
    pass: 'edcnmmtlusecbshk'
  }
});

export const RemindFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {

    const addressee: IRemind = req.body;

    const mailOptions = {
      from: 'Your Account Name <yourgmailaccount@gmail.com>',
      to: addressee.email,
      subject: 'I\'M A PICKLE!!!',
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome Email Mysterious</title>
        </head>
        <body style="margin: 0; padding: 0; box-sizing: border-box; background-color: black;">
          <table style="width: 100%; margin: 0; padding: 0; box-sizing: border-box; border-collapse: collapse; border-spacing: 0; text-indent: 0;" role="presentation" cellpadding="0" cellspacing="0" border-spacing="0" cellpadding="0">
            <tbody>
              <tr style="width: 100%; height: 60px; margin: 0; padding: 0; display: inline-block; border-bottom: 1px solid #ffffff; box-sizing: border-box; text-align: start;">
                <td style="width: 56px; height: 60px; margin: 0; padding: 12px 10px; border-right: 1px solid #ffffff; display: inline-block; box-sizing: border-box;">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACvSURBVHgB7ZjBCYUwEESzvwJLSCkpzU5+C5ZgCXagJdjBGsGDhB1GwUMO8yCELEPyDtnLWnqAuw91G9q6mW0gn4PyXvN7+oL6wOgxOchmkP0/eeuXOkNCjO6E7H64PmkJcvlaLXOKKUHt7LAlqE+w+6pQAR0ygvwWZFeQRZ1a7jn9IYaEGBJiSIghIYaEGBJiSIghIYaEGBJiSIghIUbfw4YTfzGOA9lw1IfGgu3dB03woWI9BJCAAAAAAElFTkSuQmCC" alt="Logo">
                </td>
                <td style="height: 100%; padding: 18px 0; margin-left: 3px; display: inline-block; box-sizing: border-box;">
                  <img style="width: 137px; height: 24px; margin: 0; padding: 0; display: inline-block; box-sizing: border-box;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIkAAAAYCAYAAADOHt4vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUASURBVHgB7VqNlds2DMbdAnUnqLKBO0HZDZwJTpmg7gRWJqgzgdUJ4k4gZYJLJ5BuArsToIQFVDDFP12uFydP33s8nkiA+CFMArIBFixYsGDBgv8dd3CDQMSV7QrbVjx0vru7+wzfIdjWNT++ip1WZgGDfy+wMlvIhWU2tnWqbRL0R0Xb8NiGnx/ZASHeUviEjnrbdradcAqiLRX/xtE11dbMl0u/VbJ69OPEdh7Y8eDRr4n4ugmsOVmPefauboG1G/TsX0Qm4Q+M7Je7iEYToS0c2s5R8iI4wt8xTanGHtV6rW01joEo2DJtifNgmC8XldKrz6DvUG2s0q/z2L5TfGKna+vVesxXu7oFfCv6lgGZvZLZqvFHSAHHIDmpfhWgLZUxV87A62ArIOykLrDe2sNTZeiUdGJMrwiPON145tY4BvfBZ4+HXuwsAvLE1gZm2ufoW/LzStldeegLHPd8Mn8fkHO2rYUhJwhdOQ/c/+VO8B3X8uPBVch2JT++V1Mip/Xdy3asYr1iOr06WNcP/GgyWOR0fWd5+8CaFQz+M77AfAZ0zlN55PUw2vCLOx8KEoJs/oM7wRttYNi0Y4D/HfeuoRUMSdMnq1ytxs/c/wNhvOV1bzWJLWKTfAIa+j8jWfyT+wd4HdQw+PaDO3GfYCKscXq8G+5DAeJG547+cHCJ0aXDIhv/EDqGybEUWDdc6ZwT82uYDwNfDvLX5RSmq95HQPvFvp3saTBILHHsygleNQ4qVk5Ok4rHa89RW9vWs7wOh+S3xBm5w0wUfBf7WjrLv4bh/u8E3XOCpIAvBO+lXO0V50P7Z11lOCacHT9v3QQKx6rm5OPxrFmpRE1QBGhp7SNO4S0zPfxzEtcYSodHEsGG9dCtUXwbxTNJXJUvEBLA6+ptlWufo2/pjEuAaFDC+tGl1YhdN4Sae33lGO6PkIc9DKdJwc/vIwkbHXnk6De2/W7bJ5EPw/VEBu7gZfAUaaFrw7AeutFYb9tb31F9S+Ck9WcYcg/KeXoYb4oDBiqu+8Sivisn96rRa8hRR//vM3goWPa2Gfv4IwwJq+QhVSzqZ8DY9YtAC202Be6v3CSQSM83mQGSylm8YB++CGgtzj1K0huGoJEkuQCnGiWkThLCf1UOqqpm5qdGjDzPNZiNOtpGxrSiC3wdfObkuYUx8EvMz2F6mA9fkp4rL+lrKgIoYGAIfIJxT5OcIKm5pyNfTpMXPVZxyEUajLzhZeiI/6qgkw7G43qbydbCfDyp/2XTf0jw/KTpcUhSG4x8zeKU5IWeSwaJc+XIi6Csq2YGLhUQpF8eydwT3AbkXdAOM6ow5UvAdGUh8/oDKafKBiNvwj308n7mNwggR38h9FYqOFY5l2w4h8dVPINmLzTof5VvcHx1XAbWmFPdXI5VzCiDMf5avuG5Jsdm7S8MV3m7AO8Kx+rkgNPvdoye98gk7DzyyN5Hn0yfciaiHLrCYzwOTU6QaAcgK/2Rmx6vI2vMCZIUKsUTCxK9ASbHZlSlME7L6k740P9hoUpTf7cm/PrLUeJdRWSG+E6YOlFYAXJI65k78twml0fRbFI0jjEdTtFioqrB4TQiOdsITZ/Z9E8FWh4zCbmtGot+MHi+9dh54vVWERuKCG+F4atok5BZ+Phu8kdHBBy+CRZj+9C7lW8d6PzoCAZbsypAvP7xUDavI/O79e2CBQsWLPim8C8YngQlKuh84gAAAABJRU5ErkJggg==" alt="Company Name">
                </td>
              </tr>
              <tr style="width: 100%; text-align: center; margin: 0; padding: 0 32px; display: inline-block; box-sizing: border-box">
                <td style="width: 100%; max-width: 536px; padding: 0; margin: 80px 0 0; text-align: start; display: inline-block; box-sizing: border-box;">
                  <h1 style="width: 100%; font-weight: 300; font-size: 52px; line-height: 52px; color: #ffffff; font-family: 'Px-Grotesk Light', sans-serif; display: inline-block; margin: 0; box-sizing: border-box;">Welcome</h1>
                  <h1 style="width: 100%; font-weight: 300; font-size: 52px; line-height: 52px; color: #ffffff; font-family: 'Px-Grotesk Light', sans-serif; display: inline-block; margin: 0; box-sizing: border-box;">{{ user_name }}</h1>
                  <p style="width: 100%; margin: 16px 0 0; font-weight: 300; font-size: 16px; line-height: 24px; color: #ffffff;font-family: 'Px-Grotesk Light', sans-serif; padding: 0; display: inline-block; box-sizing: border-box;">We are glad to welcome you to the Mysterious project. The project will be launched soon (launch date to be posted later with another email). We are glad to announce - you will receive your own NFT available only for those who registered before launch date. Your NFT will be sent to your account at the point of the project launch</p>
                  <p style="width: 100%; margin: 24px 0 40px; font-weight: 300; font-size: 16px; line-height: 24px; color: #ffffff;font-family: 'Px-Grotesk Light', sans-serif; padding: 0; display: inline-block; box-sizing: border-box;">If you are interested in more details, please let us know, and our specialist will contact you in the nearest time.</p>
                </td>
              </tr>
              <tr style="width: 100%; height: 60px; padding: 20px 32px; border-top: 1px solid #ffffff; text-align: start; margin: 0; display: inline-block; box-sizing: border-box;">
                <td style="width: 100%; max-width: 536px; text-align: start; padding: 0; margin: 0; display: inline-block;box-sizing: border-box;">
                  <p style="font-size: 16px; line-height: 18px; font-family: 'Px-Grotesk Light', sans-serif; color: #D9D9D9; margin: 0; padding: 0; display: inline-block; box-sizing: border-box;">mysterious.xyz</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
      `
    };

    transporter.sendMail(mailOptions, (e: any, info: any) => {
      if (e) {
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }
      res.status(200).send(new ResponseBody({}, true));
    });
  }
);
