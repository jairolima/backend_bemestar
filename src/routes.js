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
const cors = require('cors');
const cron = require("node-cron");

const corsOptions = {
  origin: ['https://agenda.policlinicabemestar.com', 'http://agenda.policlinicabemestar.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


cron.schedule("0 */6 * * *", () => {
    // VERIFICAR SE O SITE ESTÁ ONLINE
    // CASO NÃO ESTEJA, PODEMOS ENVIAR UM E-MAIL INFORMANDO
    console.log("Só será executado em uma hora e repetirá (de 1 em 1 hora) até ser desativado...");
});


routes.post('/users', cors(corsOptions), UserController.store);
routes.post('/sessions', cors(corsOptions), SessionController.store);
routes.put('/confirmation', WhatsappConfirmationController.update);

routes.get('/', (req, res) => res.send('Backend OK'));
routes.get('/allappointments', cors(corsOptions), AllappointmentController.index);
routes.get('/quantityappointments', cors(corsOptions), QuantityappointmentController.index);
routes.get('/providers', cors(corsOptions), ProviderController.index);
routes.get('/providers/:providerId/available', cors(corsOptions), AvailableController.index);

routes.use(authMiddleware);

routes.put('/users', cors(corsOptions), UserController.update);
routes.put('/doctors', cors(corsOptions), DoctorController.update);

routes.get('/appointments', cors(corsOptions), AppointmentController.index);
routes.post('/appointments', cors(corsOptions), AppointmentController.store);

routes.put('/allappointments', cors(corsOptions), AllappointmentController.update);

routes.delete('/appointments/:id', cors(corsOptions), AppointmentController.delete);

routes.get('/schedule', cors(corsOptions), ScheduleController.index);

routes.get('/notifications', cors(corsOptions), NotificationController.index);
routes.put('/notifications/:id', cors(corsOptions), NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
