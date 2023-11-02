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
  const date = req.body.date;
  const time = req.body.time;
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
          if (item.id == id) {
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

  fs.readFile(LOG_JSON_FILE_FATH, "utf-8", (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        const jsonLogData = JSON.parse(data);

        const newEventObj = {
          date: date,
          time: time,
          access: access,
          identifier: key,
        };

        fs.readFile(JSON_FILE_PATH, "utf-8", (err, data) => {
          if (err) {
            // Handle errors, e.g., file not found
            res.status(500).json({ error: "Failed to read the JSON file" });
          } else {
            // Parse the JSON data
            const jsonData = JSON.parse(data);

            // Iterate over array and try to get id of element
            for (const item of jsonData) {
              if (item.key == key) {
                // Add to event object id as identifier
                newEventObj.identifier = item.id;
                break; // Exit the loop once the operation is done
              }
            }

            jsonLogData.push(newEventObj);

            fs.writeFile(
              LOG_JSON_FILE_FATH,
              JSON.stringify(jsonLogData),
              (err) => {
                if (err) {
                  res
                    .status(500)
                    .json({ error: "Failed to update the JSON file" });
                }
              }
            );
          }
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
});

app.get("/log", (req, res) => {
  fs.readFile(LOG_JSON_FILE_FATH, "utf-8", (err, data) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(500).json({ error: "Failed to read the JSON file" });
    } else {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Send the modified data as a JSON response
        res.json(jsonData);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse the JSON data" });
      }
    }
  });
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
