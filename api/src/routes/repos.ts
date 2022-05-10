import { Router, Request, Response } from 'express';
import localData from '../../data/repos.json';
import fetch from 'node-fetch';

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  let repositories = await getData();

  repositories = repositories.filter((repository) => {
    return repository.fork === false;
  });

  res.header('Cache-Control', 'no-store');

  res.status(200);

  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
  res.json(repositories);
});

const getData = async () => {
  const remoteData = await fetch(
    'https://api.github.com/users/silverorange/repos'
  );

  if (remoteData.ok) {
    const data = await remoteData.json();
    return localData.concat(data);
  }
  return localData;
};
