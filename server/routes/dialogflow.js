const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const config = require('../config/keys');

// sessionId는 config 폴더에서 자유롭게 변경 가능하다.
const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

 // Create a new session
 const sessionClient = new dialogflow.SessionsClient();
 const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// 두개의 라우터를 만든다

// Text Query Router
// callback 함수에 async를 써줘야 await을 사용 가능
router.post('/textQuery', async (req, res) => {
     // We need to send some information that comes from the client to Dialogflow API

        // The text query request.
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              // The query to send to the dialogflow agent
              text: req.body.text,
              // The language used by the client (en-US)
              languageCode : languageCode
            },
          },
        };

           // Send request and log result
      const responses = await sessionClient.detectIntent(request);
      console.log('Detected intent');
      const result = responses[0].queryResult;
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      
     
     res.send(responses)
    
})


// Event Query Router

router.post('/eventQuery', async (req, res) => {
      // The text query request.
      const request = {
        session: sessionPath,
        queryInput: {
          event: {
            // The query to send to the dialogflow agent
            name: req.body.event,
            // The language used by the client (en-US)
            languageCode : languageCode
          },
        },
      };

         // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    
    
    res.send(responses);
})


module.exports = router;
