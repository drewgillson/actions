import * as Hub from "../../hub"

//import * as req from "request-promise-native"

const TAG = "atb-hackathon"

export class HackathonAction extends Hub.Action {

  description = "Built for ATB Hackathon demo"
  label = "Send Gift"
  name = "atb-hackathon"
  params = []
  supportedActionTypes = [Hub.ActionType.Cell]
  usesStreaming = false
  supportedFormattings = [Hub.ActionFormatting.Unformatted]
  supportedVisualizationFormattings = [Hub.ActionVisualizationFormatting.Noapply]
  supportedFormats = [Hub.ActionFormat.JsonDetail]
  requiredFields = [{ tag: TAG }]

  async execute(request: Hub.ActionRequest) {

    if (!request.formParams.amount) {
      throw "Missing amount."
    }

    const providedAmount = request.formParams.amount
    const accountId = request.params.value

    try {
      //await request.stream(async (readable) => {
      //  return req.post({ uri: providedUrl, body: readable } ).promise()
      //})
      const {BigQuery} = require('@google-cloud/bigquery');
      const bigquery = new BigQuery();
    
      async function insertRowsAsStream() {
        const datasetId = 'acme_d74db22fd0eb894f518f9a11210d179';
        const tableId = 'transactions_dates';
        const rows = [
          {amount: providedAmount, posted: '2020-02-09 01:00:00', description: 'From Looker', type: 'GIFT', this_account: accountId, other_account: '', completed: '2020-02-09 02:00:00', id: '', JID: 0, random_date: '2020-02-09 03:00:00'},
        ];
        console.log(rows)
    
        // Insert data into a table
        await bigquery
          .dataset(datasetId)
          .table(tableId)
          .insert(rows);
        console.log(`Inserted ${rows.length} rows`);
      }
      insertRowsAsStream();

      return new Hub.ActionResponse({ success: true })
    } catch (e) {
      return new Hub.ActionResponse({ success: false, message: e.message })
    }
  }

  async form() {
    const form = new Hub.ActionForm()
    form.fields = [{
      label: "Amount",
      name: "amount",
      required: true,
      type: "string",
    }]
    return form
  }
}

Hub.addAction(new HackathonAction())