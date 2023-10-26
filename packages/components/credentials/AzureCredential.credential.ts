import { INodeParams, INodeCredential } from '../src/Interface'

class AzureApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    optional: boolean
    credential: INodeParams
    inputs: INodeParams[]   

    constructor() {
        this.label = 'Azure security credentials'
        this.name = 'AzureApi'
        this.version = 1.0
        this.optional = true
        this.credential = {
            label: 'Azure Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['AzureApi']
        }
        this.inputs = [
            {
                label: 'Connection String',
                name: 'connectionstring',
                type: 'string',
                optional: false
            }
        ]
    }
}

module.exports = { credClass: AzureApi }
