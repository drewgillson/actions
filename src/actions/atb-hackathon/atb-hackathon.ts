import * as Hub from "../../hub"

//import * as req from "request-promise-native"

export class HackathonAction extends Hub.Action {

  description = "Built for ATB Hackathon demo"
  label = "Send Nudge (ATB Hackathon)"
  name = "atb-hackathon"
  requiredFields = []
  params = []
  supportedActionTypes = [Hub.ActionType.Query]
  usesStreaming = true
  supportedFormattings = [Hub.ActionFormatting.Unformatted]
  supportedVisualizationFormattings = [Hub.ActionVisualizationFormatting.Noapply]
  supportedFormats = [Hub.ActionFormat.JsonDetail]

  async execute(request: Hub.ActionRequest) {

    if (!request.formParams.amount) {
      throw "Missing amount."
    }

    const providedAmount = request.formParams.amount

    try {
      //await request.stream(async (readable) => {
      //  return req.post({ uri: providedUrl, body: readable } ).promise()
      //})
      const {BigQuery} = require('@google-cloud/bigquery');
      const bigquery = new BigQuery();
    
      async function insertRowsAsStream() {
        const datasetId = 'acme_d74db22fd0eb894f518f9a11210d179';
        const tableId = 'transactions';
        const rows = [
          {amount: providedAmount, posted: '2020-02-09 00:00:00', description: 'From Looker', type: 'GIFT', this_account: '', other_account: '', completed: '2020-02-09 00:00:00', id: ''},
        ];
    
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