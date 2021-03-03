import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import NewAllUsersController from './app/controllers/NewAllUsersController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import NewProviderController from './app/controllers/NewProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
import AllappointmentController from './app/controllers/AllappointmentController';
import NewDrAppointmentController from './app/controllers/NewDrAppointmentController';
import QuantityappointmentController from './app/controllers/QuantityappointmentController';
import DoctorController from './app/controllers/DoctorController';
import WhatsappConfirmationController from './app/controllers/WhatsappConfirmationController';
import FilterController from './app/controllers/FilterController';
import BlockController from './app/controllers/BlockController';
import axios from 'axios';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
// const cors = require('cors');
var cron = require("node-cron");

// const corsOptions = {
//   origin: [],
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }



var task = cron.schedule('0 8 * * *', () => {
  console.log('Running a job at 08:00 at America/Sao_Paulo timezone');
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

task.start();

var doctorTask = cron.schedule('*/2 * * * *', () => {
  console.log('Running a job at 2min at America/Sao_Paulo timezone');


  async function sendDr() {
    await axios.get(`https://api.policlinicabemestar.com/drappointments/${process.env.GENERAL_TOKEN}/507`)
      .then(function (response) {
        // handle success
        console.log(response);

        const appointments = response.data

        if (appointments === '') {
          console.log('sendDr appointments empty')
        } else {
          axios.get(
            `https://api.dr.help/message?number=5583988736747&message=Este é um lembrete, os seus pacientes de amanhã são:&token=${process.env.ZAP_TOKEN}`
          )
          appointments.map(appointment =>
            axios.get(
              `https://api.dr.help/message?number=5583988736747&message=${appointments.cliente}, ${appointments.data}, ${appointments.filtro}&token=${process.env.ZAP_TOKEN}`
            )
          )
        }

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  sendDr()



}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

doctorTask.start();



routes.get('/newallusers/:token', NewAllUsersController.index);

routes.get('/blockdays', BlockController.index);
routes.post('/blockdays', BlockController.store);
routes.put('/blockdays/:id', BlockController.update);
routes.delete('/blockdays/:id/:token', BlockController.delete);

routes.post('/filters', FilterController.store);
routes.get('/filters', FilterController.index);
routes.put('/filters/:id', FilterController.update);
routes.delete('/filters/:id', FilterController.delete);

routes.get('/newproviders', NewProviderController.index);

routes.get('/drappointments/:token/:id', NewDrAppointmentController.index);

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
