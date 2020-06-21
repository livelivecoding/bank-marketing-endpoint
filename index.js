const automl = require('@google-cloud/automl')
const express = require('express')
const cors = require('cors')
/**
 * Demonstrates using the AutoML client to request prediction from
 * automl tables using online predictions.
 */
const app = express()
app.use(cors())

const projectId = 'streaming-analytics-showcase'
const computeRegion = 'us-central1'
const modelId = 'TBL8342562067936444416'

const client = new automl.v1beta1.PredictionServiceClient()
const modelFullId = client.modelPath(projectId, computeRegion, modelId)

app.get('/', async(req, res) => { //localhost:8080?duration=200
    const duration = Number(req.query.duration)
    const params = {}
    const payload = {
        "row": {
            "values": [
                { numberValue : 51 }, //Age
                { stringValue: "blue-collar" }, //Job
                { stringValue: "married" }, //MaritalStatus
                { stringValue: "primary" }, //Education
                { stringValue: "no" }, //Default
                { numberValue: 620 }, //Balance
                { stringValue: "yes" }, //Housing
                { stringValue: "yes" }, //Loan
                { stringValue: "cellular" }, //Contact
                { numberValue: 29 }, //Day
                { stringValue: "jul" }, //Month
                { numberValue: req.query.duration }, //Duration
                { numberValue: 10 }, //Campaign
                { numberValue: -1 }, //PDays
                { numberValue: 0 }, //Previous
                { stringValue: "unknown" } //POutcome
            ]
        }
    }

    try {
        const [response] = await client.predict({
            name: modelFullId,
            payload: payload,
            params: params
        })
        const output = response.payload.map(result => (
          {
            prediction: result.tables.value.stringValue,
            score: result.tables.score
          }
        ))
        res.send(output)
    } catch (err) {
        console.log(err)
    }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Hola mama, estoy en la Tele', port)
})