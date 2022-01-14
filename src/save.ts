import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const bucket = process.env.GCS_CACHER_BUCKET;
    if(bucket === undefined) { return; }

    const path: string = core.getInput('path');
    const key: string = core.getInput('key');

    try {
      await exec.exec('gcs-cacher', ['-bucket', bucket, '-cache', key, '-dir', path]);
    } catch(e) {
      core.info('Cache saving failed or interrupted; removing incomplete archive from remote..');
      await exec.exec('gsutil', ['rm', key], { ignoreReturnCode: true });
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
