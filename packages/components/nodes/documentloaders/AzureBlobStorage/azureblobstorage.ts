import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { AzureBlobStorageFileLoader } from 'langchain/document_loaders/web/azure_blob_storage_file'

class AzureBlobStorage_DocumentLoaders implements INode {
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
        this.label = 'Azure Blob Storage'
        this.name = 'AzureBlobStorage'
        this.version = 1.0
        this.type = 'Document'
        this.icon = 'azureblobstorage.png'
        this.category = 'Document Loaders'
        this.description = 'Load Data from Azure Blob Storage'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Connection String',
                name: 'ConnectionString',
                type: 'string'
            },
            {
                label: 'Container Name',
                name: 'ContainerName',
                type: 'string'
            },
            {
                label: 'Blob Name',
                name: 'BlobName',
                type: 'string'
            },
            {
                label: 'Unstructured API URL',
                name: 'UnstructuredAPIurl',
                type: 'string'
            }
        ]
    }
    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const constring = nodeData.inputs?.ConnectionString as string
        const contname = nodeData.inputs?.ContainerName as string
        const Blobname1 = nodeData.inputs?.BlobName as string
        const unApiURL = nodeData.inputs?.UnstructuredAPIurl as string
        const loader = new AzureBlobStorageFileLoader({
            azureConfig: {
                connectionString: constring,
                container: contname,
                blobName: Blobname1
            },
            unstructuredConfig: {
                apiUrl: unApiURL,
                apiKey: '' // this will be soon required
            }
        })
        const docs = await loader.load()
        console.log(docs)
    }
}
module.exports = { nodeClass: AzureBlobStorage_DocumentLoaders }
