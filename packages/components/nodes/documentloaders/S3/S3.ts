import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { S3Loader } from 'langchain/document_loaders/web/s3'
import { getCredentialData, getCredentialParam } from '../../../src/utils'

class S3_DocumentLoaders implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    credential: INodeParams
    inputs?: INodeParams[]

    constructor() {
        this.label = 'S3'
        this.name = 'S3'
        this.version = 1.0
        this.type = 'Document'
        this.icon = 'S3.png'
        this.category = 'Document Loaders'
        this.description = 'Load Data from S3 Buckets'
        this.baseClasses = [this.type]
        this.credential = {
            label: 'Secret Access Key',
            name: 'SecretAccessKeyID',
            type: 'credential',
            description: 'Credentials',
            credentialNames: ['S3Api']
        }
        this.inputs = [
            {
                label: 'Bucket',
                name: 'BucketName',
                type: 'string'
            },
            {
                label: 'Key',
                name: 'FileName',
                type: 'string',
                description: 'Mention the file name along with the type'
            },
            {
                label: 'Region of the Bucket',
                name: 'Region',
                type: 'string'
            },
            {
                label: 'Unstructured API URL',
                name: 'UnstructuredAPIurl',
                type: 'string'
            },
            {
                label: 'Access Key',
                name: 'AccessKey',
                type: 'string'
            }
        ]
    }
    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const bucket1 = nodeData.inputs?.BucketName as string
        const file_name = nodeData.inputs?.FileName as string
        const region1 = nodeData.inputs?.Region as string
        const unApiURL = nodeData.inputs?.UnstructuredAPIurl as string
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const AccessKeyID1 = nodeData.inputs?.AccessKey as string
        const SecretAccessKeyID1 = getCredentialParam('SecretAccessKeyID', credentialData, nodeData)
        const loader = new S3Loader({
            bucket: bucket1,
            key: file_name,
            s3Config: {
                region: region1,
                credentials: {
                    accessKeyId: AccessKeyID1,
                    secretAccessKey: SecretAccessKeyID1
                }
            },
            unstructuredAPIURL: unApiURL,
            unstructuredAPIKey: ''
        })
        const docs = await loader.load()
        console.log(docs)
    }
}
module.exports = { nodeClass: S3_DocumentLoaders }
