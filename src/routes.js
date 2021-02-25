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
import FilterController from './app/controllers/FilterController';
import BlockController from './app/controllers/BlockController';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
// const cors = require('cors');
const cron = require("node-cron");

// const corsOptions = {
//   origin: [],
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }



cron.schedule('0 8 * * *', () => {
  console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
  axios.get(
    `https://api.dr.help/message?number=5583988736747&message=Teste CRON, só será executado às 08:00 horas e repetirá todo dia...&token=${process.env.ZAP_TOKEN}`
  );
  axios.get(
    `https://api.dr.help/message?number=558391389448&message=Teste CRON, só será executado às 08:00 horas e repetirá todo dia...&token=${process.env.ZAP_TOKEN}`
  );
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

routes.post('/filters', FilterController.store);
routes.get('/filters', FilterController.index);
routes.put('/filters/:id', FilterController.update);
routes.delete('/filters/:id', FilterController.delete);

routes.get('/blockdays', BlockController.index);
routes.post('/blockdays', BlockController.store);
routes.put('/blockdays/:id', BlockController.update);
routes.delete('/blockdays/:id', BlockController.delete);

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
