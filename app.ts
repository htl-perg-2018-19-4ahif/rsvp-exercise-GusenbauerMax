import {CREATED, BAD_REQUEST, UNAUTHORIZED} from 'http-status-codes';
import * as loki from 'lokijs';
import * as express from 'express';
import * as basic from 'express-basic-auth';

const app = express();
app.use(express.json());

import {Request, Response} from 'express';

let db = new loki('loki.json');
let guests = db.addCollection('guests');

//const adminFilter = basic({ users: { admin: 'test' }});

app.get('/party', getAll);
app.get('/api/guests', list, /*adminFilter*/);
app.post('/register', register);

export function getAll(req: Request, res: Response): void {
  res.send({
    party: "Halloweenparty",
    location: "Baumgartenberg",
    date: new Date(2019, 31, 10)
  });
}

export function register(req: Request, res: Response): void {
  if (!req.body.firstName || !req.body.lastName) {
    res.status(BAD_REQUEST).send('Missing Members');
  } else {
    const count = guests.count();
    if (count < 10){
      guests.insert({firstName:req.body.fn, lastName: req.body.ln});
    }
    if (count < 10) {
      const newDoc = guests.insert({firstName:req.body.fn, lastName: req.body.ln});
      res.status(CREATED).send(newDoc);
    } else {
      res.status(UNAUTHORIZED).send('Too many guests');
    }
  }
}

export function list(req: Request, res: Response): void {
  res.send(guests.find());
}

app.listen(9000, () => console.log('API is listening on port 9000'));