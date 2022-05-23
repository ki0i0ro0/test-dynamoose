import * as dynamoose from 'dynamoose'

dynamoose.aws.sdk.config.update({
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'us-east-1',
})
