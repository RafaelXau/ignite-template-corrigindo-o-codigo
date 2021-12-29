const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function repositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" })
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", repositoryExists, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  Object.keys(repository).map(key => {
    if (key !== "likes") {
      repository[key] = updatedRepository[key] || repository[key];
    } else {
      repository[key] = repository[key];
    }
  });

  return response.json(repository);
});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  const repository = request.repository;

  repositories.splice(repositories.indexOf(repository), 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
