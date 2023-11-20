import express, { json } from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 8000;
const JSON_FILE_PATH = "./data/elems.json"; // Path to elements JSON file
const LOG_JSON_FILE_FATH = "./data/log.json"; // Path to log JSON file
const AUTH_JSON_FILE_PATH = "./data/auth.json"; // Path to auth JSON file

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/elems", (req, res) => {
  // Use fs.readFile to read the JSON file asynchronously
  fs.readFile(JSON_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        // Send the JSON data as a response
        res.json(jsonData);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
});

app.post("/elem", (req, res) => {
  const id = req.body.id;
  const access = req.body.access;
  const key = req.body.key;

  fs.readFile(JSON_FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Iterate over array and change element data
        for (const item of jsonData) {
          if (item.id === id) {
            // Change the id value to a new value (e.g., 10)
            item.access = access;
            item.key = Number(key);
            break; // Exit the loop once the modification is done
          }
        }

        fs.writeFile(JSON_FILE_PATH, JSON.stringify(jsonData), (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to update the JSON file" });
          }
        });

        // Send the modified data as a JSON response
        res.json({ result: "Success" });
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
});

app.get("/log", (req, res) =>

// запрос журнала событий с фронта
{
  const jsonData = EventParse(LOG_JSON_FILE_FATH);
      if (jsonData) {
        res.json(jsonData); // Отпрвка журнала событий на фронт
      } else {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
});


app.post("/auth", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  fs.readFile(AUTH_JSON_FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        const jsonData = JSON.parse(data);

        if (jsonData.login === login && jsonData.password == password) {
          res.json({ authorized: true });
        } else {
          res.status(500).json({ error: "Authorization failed" });
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
});



// requests for embedded
app.get("/keys", (req, res) => {
  fs.readFile(JSON_FILE_PATH, (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Array of keys with access 1
        let array = [];

        // Iterate over array and look for key with access 1
        for (const item of jsonData) {
          if (item.access == 1) {
            // Add key to array
            array.push(item.key);
          }
        }

        let strOfKeys = array.join("*");

        res.send(strOfKeys);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
});



app.post("/logEmbedded", (req, res) => {

    try {
       let eventsArray = req.body; // читает журнал переданный от контроллера

        fs.writeFile(LOG_JSON_FILE_FATH, JSON.stringify(eventsArray),(err) => {
        if (err) {
         res
          .status(500)
          .json({error: "Failed to update the JSON file"});
         } else res.json({result: "Success"});
        });
  }
          catch (error) {
            res.status(500).json({error: "Failed to parse the JSON data"});
          };
});

function EventParse (fileName) {
  fs.readFile(fileName, "utf-8", (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      console.log("Failed to read the JSON file");
      return null;
    } else {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data); // Парсинг файла в json

        return jsonData;

      }
      catch (error) {
        return null;
      }
    }
  });
}



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

/*
const jsonData = EventParse(JSON_FILE_PATH);
const jsonLogData = EventParse(LOG_JSON_FILE_FATH);

 */

/*


// Iterate over array and try to get id of element
for (const item of jsonData) {
  if (item.key == el.identifier) {
    // Add to event object id as identifier
    el.identifier = item.id;
    accessOfEvent = item.access;
    break; // Exit the loop once the operation is done
  }
}

el.access = accessOfEvent;
jsonLogData.push(el);
});



*/
/*
формирование журнала



function IterateEvent (jKeyData, jLogData)
{
    let accessOfEvent = null;

    // Iterate over array and try to get id of element
    for (const item of jKeyData) {
      if (item.key === el.identifier) {
        // Add to event object id as identifier
        el.identifier = item.id;
        accessOfEvent = item.access;
        break; // Exit the loop once the operation is done
      }
    }

    el.access = accessOfEvent;
    jLogData.push(el);
  });    */