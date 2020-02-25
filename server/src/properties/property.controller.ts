import * as express from 'express';

import { PropertyService } from './property.service';

const propertyService = new PropertyService();

const controller = express.Router();

controller.post('/', async (req, res) => {
  const property = req.body;
  const id = await propertyService.createProperty(property);
  res.send(JSON.stringify(id));
});

controller.get('/', async (req, res) => {
  const query = req.body;
  const properties = await propertyService.listProperties();
  res.send(properties);
});

controller.get('/:id', async (req, res) => {
  const id = req.params['id'];
  const property = await propertyService.getProperty(id);
  res.send(property);
})

controller.patch('/:id', async (req, res) => {
  const property = req.body;
  const id = await propertyService.updateProperty(property);
  res.send(JSON.stringify(id));
});

controller.delete('/:id', async (req, res) => {
  const id = req.params['id'];
  const result = await propertyService.deleteProperty(id);
  res.send(JSON.stringify(result));
});

export { controller as PropertyController };