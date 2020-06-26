import express from "express";
const app = express();
import cors from "cors";
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);
app.locals.title = "Pet Box";

app.get("/", (request, response) => {
  // response.send("Oh hey Pet Box");
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});

app.locals.pets = [
  { id: "a1", name: "Rover", type: "dog" },
  { id: "b2", name: "Marcus Aurelius", type: "parakeet" },
  { id: "c3", name: "Craisins", type: "cat" },
];

app.get("/api/v1/pets", (request, response) => {
  const pets = app.locals.pets;
  response.json({ pets });
});

app.get("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find((pet) => pet.id === id);
  if (!pet) {
    return response.sendStatus(404);
  }

  response.status(200).json(pet);
});

app.post("/api/v1/pets", (request, response) => {
  const id = Date.now().toString();
  const pet = request.body;

  for (let requiredParameter of ["name", "type"]) {
    if (!pet[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  const { name, type } = pet;
  app.locals.pets.push({ name, type, id });
  response.status(201).json({ name, type, id });
});

app.patch("/api/v1/pets/:id", (request, response) => {
  const pets = app.locals.pets;
  const { id } = request.params;
  let pet = pets.find((pet) => pet.id === id);
  if (!pet) {
    return response.sendStatus(404);
  }
  pet.name = request.body.name;
  response.json(pet);
});

app.delete("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  let pet = app.locals.pets.find((pet) => pet.id === id);
  let index = app.locals.pets.indexOf(pet);
  app.locals.pets.splice(index, 1);
  if (!pet) {
    return response.sendStatus(404);
  }
  response.json(
    "The pet had been deleted and there are " + app.locals.pets.length + " left"
  );
});
