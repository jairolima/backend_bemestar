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


// %0a pula linha no whatsapp

// var task = cron.schedule('0 8 * * *', () => {
//   console.log('Running a job at 08:00 at America/Sao_Paulo timezone');
//   axios.get(
//     `https://api.dr.help/message?number=5583988736747&message=Teste CRON, só será executado às 08:00 horas e repetirá todo dia...&token=${process.env.ZAP_TOKEN}`
//   );
//   axios.get(
//     `https://api.dr.help/message?number=558391389448&message=Teste CRON, só será executado às 08:00 horas e repetirá todo dia...&token=${process.env.ZAP_TOKEN}`
//   );
// }, {
//   scheduled: true,
//   timezone: "America/Sao_Paulo"
// });

// task.start();

var resume = cron.schedule('0 8 * * *', () => {
  console.log('Running a job at 08:00 at America/Sao_Paulo timezone');
  axios.get(
    `https://api.dr.help/message?number=5583988736747&message=*Resumo diario*%0a%0aFaturamento: *R$value1*%0aLucro: *R$value2*%0a%0aAtendimentos: *value3*%0aNovos Clientes: *value4*%0aAmanhã: *value5*&token=${process.env.ZAP_TOKEN}`
  );
  axios.get(
    `https://api.dr.help/message?number=558391389448&message=*Resumo diario*%0a%0aFaturamento: *R$value1*%0aLucro: *R$value2*%0a%0aAtendidos: *value3*%0aNovos Clientes: *value4*%0aAmanhã: *value5*&token=${process.env.ZAP_TOKEN}`
  );
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

resume.start();


var doTask = cron.schedule('0 18 * * *', () => {
  console.log("18h")
  // Make a request for a user with a given ID



  async function sendDr() {


    await axios.get(`https://api.policlinicabemestar.com/drappointments/${process.env.GENERAL_TOKEN}/9`)
      .then(function (response) {
        // handle success
        // const appointments = Object.keys(response.data.rows)[0]

        // Para funcionar remover array estatico e por prox linha
        // const appointmentscru = response.data
        const appointmentscru = {
          "rows": [
            {
              "ID": 2760,
              "Cliente": "Jairo Bezerra de Lima Junior",
              "Prestador": "Dr. Carlos Antonio",
              "Data": "dia 03 de março, às  09:30h",
              "CPF": "077.261.924-70",
              "Telefone": "(83)98873-6747",
              "Filtro": "Cardiologista",
              "Preço": "150",
              "Plano": null,
              "Compareceu": null,
              "Confirmou": null,
              "Pagamento": null,
              "Descrição": null,
              "Recepcionista": null,
              "Desconto": null,
              "Comissão": "50"
            },
            {
              "ID": 2761,
              "Cliente": "Jairo Bezerra de Lima Junior",
              "Prestador": "Dr. Carlos Antonio",
              "Data": "dia 03 de março, às  10:30h",
              "CPF": "077.261.924-70",
              "Telefone": "(83)98873-6747",
              "Filtro": "Cardiologista",
              "Preço": "150",
              "Plano": null,
              "Compareceu": null,
              "Confirmou": null,
              "Pagamento": null,
              "Descrição": null,
              "Recepcionista": null,
              "Desconto": null,
              "Comissão": "50"
            }
          ]
        }

        const appointments = appointmentscru.rows[0]

        console.log(appointments)

        if (!appointments) {
          console.log('sendDr appointments empty')
        } else {
          // axios.get(
          //   `https://api.dr.help/message?number=5583988736747&message=Este é um lembrete, os seus pacientes de amanhã são:&token=${process.env.ZAP_TOKEN}`
          // )

          axios.get(
            `https://api.dr.help/message?number=5583988736747&message=*Lembrete dr.help*%0a%0aOlá _${appointments.Prestador}_,%0aO seu primeiro paciente na Policlínica Bem Estar é _${appointments.Cliente}_, *amanhã* _${appointments.Data}_%0a%0aAtuação: _${appointments.Filtro}_&token=${process.env.ZAP_TOKEN}`
          )

          // appointments.forEach((appointment) => {
          //   // return axios.get(
          //   //   `https://api.dr.help/message?number=5583988736747&message=${appointment.Cliente}%0a${appointment.Data}%0a${appointment.Filtro}&token=${process.env.ZAP_TOKEN}`
          //   // )
          //   console.log(appointment.Cliente)
          // });

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

doTask.start();


// var doctorTask = cron.schedule('*/1 * * * *', () => {
//   console.log('Running a job at 2min at America/Sao_Paulo timezone');


// async function sendDr() {


//   await axios.get(`https://api.policlinicabemestar.com/drappointments/${process.env.GENERAL_TOKEN}/507`)
//     .then(function (response) {
//       // handle success
//       const appointments = Object.keys(response.data.rows)[0]

//       if (appointments === '') {
//         console.log('sendDr appointments empty')
//       } else {
//         // axios.get(
//         //   `https://api.dr.help/message?number=5583988736747&message=Este é um lembrete, os seus pacientes de amanhã são:&token=${process.env.ZAP_TOKEN}`
//         // )

//         axios.get(
//           `https://api.dr.help/message?number=5583988736747&message=🕑 *Lembrete dr.help*%0a%0aOlá _${appointments.Prestador}_,%0aO seu primeiro paciente na Policlínica Bem Estar é _${appointments.Cliente}_, *amanhã* _${appointments.Data}_%0a%0aAtuação: _${appointments.Filtro}_&token=${process.env.ZAP_TOKEN}`
//         )

//         // appointments.forEach((appointment) => {
//         //   // return axios.get(
//         //   //   `https://api.dr.help/message?number=5583988736747&message=${appointment.Cliente}%0a${appointment.Data}%0a${appointment.Filtro}&token=${process.env.ZAP_TOKEN}`
//         //   // )
//         //   console.log(appointment.Cliente)
//         // });

//       }

//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
//     .then(function () {
//       // always executed
//     });
// }

// sendDr()


// }, {
//   scheduled: true,
//   timezone: "America/Sao_Paulo"
// });

// doctorTask.start();



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
