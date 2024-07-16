import * as core from '@actions/core'
import { wait } from './wait'
import { InputParams } from './params'
import CDN_SDK from 'tencentcloud-sdk-nodejs/tencentcloud/services/cdn'
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface'

const CDN_CLIENT = CDN_SDK.cdn.v20180606.Client
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const secret_id: string = core.getInput(InputParams.SecretID)
    const secret_key: string = core.getInput(InputParams.SecretKey)
    const urls: string = core.getInput(InputParams.URLS)
    const paths: string = core.getInput(InputParams.PATHS)
    const clientConfig: ClientConfig = {
      credential: {
        secretId: secret_id,
        secretKey: secret_key
      },
      profile: {
        language: 'en-US'
      }
    }
    const cdnClient = new CDN_CLIENT(clientConfig)
    if (urls) {
      const urlsArr = urls.split(',')
      const urlsParams = {
        Urls: urlsArr
      }
      await cdnClient.PurgeUrlsCache(urlsParams)
    }
    if (paths) {
      const pathsArr = paths.split(',')
      const pathsParams = {
        FlushType: 'delete',
        Paths: pathsArr
      }
      await cdnClient.PurgePathCache(pathsParams)
    }
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    // core.debug(`Waiting ${ms} milliseconds ...`)

    // Set outputs for other workflow steps to use
    core.setOutput('time', 'success')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
