import { INodeParams, INodeCredential } from '../src/Interface'

class AWSApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    optional: boolean
    credential: INodeParams
    inputs: INodeParams[]   

    constructor() {
        this.label = 'AWS security credentials'
        this.name = 'awsApi'
        this.version = 1.0
        this.description =
            'Your <a target="_blank" href="https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html">AWS security credentials</a>.'
        this.credential = {
            label: 'AWS Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['awsApi']
        }
        this.inputs = [
            {
                label: 'AWS Access Key',
                name: 'awsKey',
                type: 'string',
                description: 'The access key for your AWS account.',
                optional: false
            },
            {
                label: 'AWS Secret Access Key',
                name: 'awsSecret',
                type: 'password',
                description: 'The secret key for your AWS account.',
                optional: false
            }
        ]
    }
}

module.exports = { credClass: AWSApi }
