import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { S3Loader } from 'langchain/document_loaders/web/s3'
import { TextSplitter } from 'langchain/text_splitter'
import { getCredentialData, getCredentialParam } from '../../../src/utils'

class S3_DocumentLoaders implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    color: string
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
        this.color = '#CC99FF'
        this.description = 'Load Data from S3 Buckets'
        this.baseClasses = [this.type]
        this.credential = {
            label: 'AWS Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['awsApi']
        }
        this.inputs = [
            {
                label: 'Bucket',
                name: 'BucketName',
                type: 'string'
            },
            {
                label: 'File Name',
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
        try {
            const bucket1 = nodeData.inputs?.BucketName as string;
            const file_name = nodeData.inputs?.FileName as string;
            const region1 = nodeData.inputs?.Region as string;
            const textSplitter = nodeData.inputs?.textSplitter as TextSplitter;
            const metadata = nodeData.inputs?.metadata1;
            const narrativeTextOnly = nodeData.inputs?.narrativeTextOnly as boolean
            const credentialData = await getCredentialData(nodeData.credential ?? '', options)
            const AccessKeyID1 = getCredentialParam('awsKey', credentialData, nodeData)
            const SecretAccessKeyID1 = getCredentialParam('awsSecret', credentialData, nodeData)
            if (bucket1 && file_name && region1 && AccessKeyID1 && SecretAccessKeyID1) {
                const loader = new S3Loader({
                    bucket: bucket1,
                    key:file_name,
                    s3Config: {
                        region: region1,
                        credentials: {
                            accessKeyId: AccessKeyID1,
                            secretAccessKey: SecretAccessKeyID1
                        }
                    },
                    unstructuredAPIURL: 'https://api.unstructured.io/general/v0/general',
                    unstructuredAPIKey: 'LnV3sMnJnBjk4heCxBZLxupWLcSNLu'
                });
                
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
                        const docs = await loader.load();
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
            
        
        } catch (error) {
            console.error('An error occurred:', error)
            throw error; 
            
        }
        
    }
}
module.exports = { nodeClass: S3_DocumentLoaders }
