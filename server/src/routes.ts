import express from 'express';
import ClassesControler from './controllers/ClassesControler';
import ConnectionsController from './controllers/ConnectionsController';


const routes = express.Router();
const classesControllers = new ClassesControler();
const connectionsController = new ConnectionsController();

routes.post('/classes', classesControllers.create);
routes.get('/classes', classesControllers.index);

routes.get('/connections', connectionsController.index)
routes.post('/connections', connectionsController.create)



export default routes;