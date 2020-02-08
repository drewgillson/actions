import * as Hub from "../../hub"

import * as req from "request-promise-native"

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

    if (!request.formParams.url) {
      throw "Missing url."
    }

    const providedUrl = request.formParams.url

    try {
      await request.stream(async (readable) => {
        return req.post({ uri: providedUrl, body: readable } ).promise()
      })
      return new Hub.ActionResponse({ success: true })
    } catch (e) {
      return new Hub.ActionResponse({ success: false, message: e.message })
    }
  }

  async form() {
    const form = new Hub.ActionForm()
    form.fields = [{
      label: "Webhook URL",
      name: "url",
      required: true,
      type: "string",
    }]
    return form
  }
}

Hub.addAction(new HackathonAction())