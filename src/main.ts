import * as core from '@actions/core'
import * as fs from 'fs'
import {parse} from './parse'
import {reportSummary} from './report-summary'

async function run(): Promise<void> {
  try {
    const jsonPath = core.getInput('json-path', {required: true})
    const specFilePrefix = core.getInput('spec-file-prefix', {required: true})

    try {
      fs.accessSync(jsonPath, fs.constants.R_OK)
    } catch (err) {
      core.warning(`${jsonPath}: access error!`)
      return
    }

    const result = parse(jsonPath, specFilePrefix)
    core.info(result.summary)

    if (!result.success) {
      await reportSummary(result)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
