import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const bucket = process.env.GCS_CACHER_BUCKET
    if (bucket === undefined) {
      return
    }

    const path: string = core.getInput('path')
    const key: string = core.getInput('key')
    const restore_keys: string[] = core.getMultilineInput('restore_keys')

    const reducer = (arr: string[], item: string): string[] => [...arr, '-restore', item]
    const restore_args = restore_keys.reduce(reducer, ['-restore', key])

    await exec.exec(
      'gcs-cacher',
      ['-bucket', bucket, ...restore_args, '-dir', path],
      {ignoreReturnCode: true}
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
