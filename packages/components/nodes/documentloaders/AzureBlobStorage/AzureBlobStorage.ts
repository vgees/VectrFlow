import { load } from 'js-yaml'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { AzureBlobStorageFileLoader } from 'langchain/document_loaders/web/azure_blob_storage_file'
import { TextSplitter } from 'langchain/text_splitter'
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
                label: 'File Name',
                name: 'BlobName',
                type: 'string',
                description: 'Mention the file name along with the type'
            },
            {
                label: 'Text Splitter',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            },
            {
                label: 'NarrativeText Only',
                name: 'narrativeTextOnly',
                description:
                    'Only load documents with NarrativeText metadata from Unstructured',
                type: 'boolean',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Metadata',
                name: 'metadata1',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
    }
    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const constring = nodeData.inputs?.ConnectionString as string
        const contname = nodeData.inputs?.ContainerName as string
        const Blobname1 = nodeData.inputs?.BlobName as string
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const metadata = nodeData.inputs?.metadata1
        const narrativeTextOnly = nodeData.inputs?.narrativeTextOnly as boolean
        try{
            if (constring && contname && Blobname1){
                const loader = new AzureBlobStorageFileLoader({
                    azureConfig: {
                        connectionString: constring,
                        container: contname,
                        blobName: Blobname1
                    },
                    unstructuredConfig: {
                        apiUrl: 'https://api.unstructured.io/general/v0/general',
                        apiKey: 'LnV3sMnJnBjk4heCxBZLxupWLcSNLu'
                    }
                })
                if (textSplitter) {
                    try{
                        const docs = await loader.loadAndSplit(textSplitter)
                        if (metadata) {
                            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata)
                            const finaldocs = docs.map((doc) => {
                                return {
                                    ...doc,
                                    metadata: {
                                        ...doc.metadata,
                                        ...parsedMetadata
                                    }
                                } 
                            })
                            return narrativeTextOnly ? finaldocs.filter((doc) => doc.metadata.category === 'NarrativeText') : finaldocs
                        }
                        return narrativeTextOnly ? docs.filter((doc) => doc.metadata.category === 'NarrativeText') : docs
                    }
                    catch(e:any){
                        throw new Error(`${e}`)
                    }
                        
        
                        }
                else{
                    try{
                        const docs = await loader.load()
                        if (metadata) {
                            const parsedMetadata = typeof metadata === 'object' ? metadata : JSON.parse(metadata)
                            const finaldocs = docs.map((doc) => {
                                return {
                                    ...doc,
                                    metadata: {
                                        ...doc.metadata,
                                        ...parsedMetadata
                                    }
                                }
                            })
                            return narrativeTextOnly ? finaldocs.filter((doc) => doc.metadata.category === 'NarrativeText') : finaldocs
                        }
                        return narrativeTextOnly ? docs.filter((doc) => doc.metadata.category === 'NarrativeText') : docs
                    }
                    catch(e:any){
                        throw new Error(`${e}`)
                    }
                }
            } else {
                console.error('Some required properties are undefined.')
            }
        }
        catch (error) {
            console.error('An error occurred:', error)
            throw error
            
        }
    }
}
module.exports = { nodeClass: AzureBlobStorage_DocumentLoaders }
