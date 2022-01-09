const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());

/* MAILGUN CONFIGURATION */
const api_key = process.env.api_key;
const domain = process.env.domain;

const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.post("/form", (req, res) => {
  console.log("Route /form");

  const { firstname, lastname, email, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} ${req.fields.telephone} <${req.fields.email}>`,
    to: "marinecorbel@yahoo.fr",
    subject: "Formulaire rempli",
    text: `${req.fields.message}`,
  };
  console.log(data);
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);

    if (!error || error === undefined) {
      res.json({ message: "Données du form bien reçues, mail envoyé." });
    } else {
      res.json(error);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
