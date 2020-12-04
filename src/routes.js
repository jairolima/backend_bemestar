import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
import AllappointmentController from './app/controllers/AllappointmentController';
import QuantityappointmentController from './app/controllers/QuantityappointmentController';
import DoctorController from './app/controllers/DoctorController';
import WhatsappConfirmationController from './app/controllers/WhatsappConfirmationController';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
// const cors = require('cors');
const cron = require("node-cron");

// const corsOptions = {
//   origin: [],
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


cron.schedule("0 */6 * * *", () => {
    // VERIFICAR SE O SITE ESTÁ ONLINE
    // CASO NÃO ESTEJA, PODEMOS ENVIAR UM E-MAIL INFORMANDO
    axios.get(
      `https://api.dr.help/message?number=5583988736747&message=Teste CRON, só será executado em 6 horas e repetirá (de 6 em 6 horas) até ser desativado...&token=${process.env.ZAP_TOKEN}`
    );

});


routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.put('/confirmation', WhatsappConfirmationController.update);

routes.get('/', (req, res) => res.send('Backend OK'));
routes.get('/allappointments', AllappointmentController.index);
routes.get('/quantityappointments', QuantityappointmentController.index);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/doctors', DoctorController.update);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.put('/allappointments', AllappointmentController.update);

routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
