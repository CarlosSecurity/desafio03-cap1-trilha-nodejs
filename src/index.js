const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];


function findRepositoryById (request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(
    (repository) => repository.id === id
  );

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository
  request.id = id
  
  return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  /*
  const repositoryAlreadyExists = repositories.some(
    (repository) => repository.title === title
  );

  if(repositoryAlreadyExists) {
    return response.status(400).json({ error: 'Repository already exists!' });
  }
  */ 
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", findRepositoryById, (request, response) => {
  const { repository, id } = request;
  const updatedRepository = request.body;


  // Merge nos objetos, colocando em segundo o que deve permanecer.
  const newRepository = { ...repository, ...updatedRepository };
  newRepository.likes = 0;

  repositories[id] = newRepository

  return response.json(newRepository);
});

app.delete("/repositories/:id", findRepositoryById, (request, response) => {
  const { id } = request;
  
  const index = repositories.findIndex(
    (repository) => repository.id === id
  )

  repositories.splice(index, 1);

  return response.status(204).send();
});

// Like
app.post("/repositories/:id/like", findRepositoryById, (request, response) => {
  const { repository } = request;

  ++repository.likes;

  return response.json(repository);
});


module.exports = app;
