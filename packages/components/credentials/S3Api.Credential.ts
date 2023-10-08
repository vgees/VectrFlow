import { INodeParams, INodeCredential } from '../src/Interface'

class S3Api implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'S3 API'
        this.name = 'S3Api'
        this.version = 1.0
        this.inputs = [
            {
                label: 'Secret Access Key',
                name: 'SecretAccessKeyID',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: S3Api }
