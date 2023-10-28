import { ICommonObject, INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { QdrantClient } from '@qdrant/js-client-rest'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { VectorStoreRetrieverInput } from 'langchain/vectorstores/base'

type RetrieverConfig = Partial<VectorStoreRetrieverInput<QdrantVectorStore>>

class Qdrant_Existing_VectorStores implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    color: string
    baseClasses: string[]
    inputs: INodeParams[]
    credential: INodeParams
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Qdrant Load Existing Index'
        this.name = 'qdrantExistingIndex'
        this.version = 1.0
        this.type = 'Qdrant'
        this.icon = 'qdrant.png'
        this.category = 'Vector Stores'
        this.color = '#FF99B2'
        this.description = 'Load existing index from Qdrant (i.e., documents have been upserted)'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            description: 'Only needed when using Qdrant cloud hosted',
            optional: true,
            credentialNames: ['qdrantApi']
        }
        this.inputs = [
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Qdrant Server URL',
                name: 'qdrantServerUrl',
                type: 'string',
                placeholder: 'http://localhost:6333'
            },
            {
                label: 'Qdrant Collection Name',
                name: 'qdrantCollection',
                type: 'string'
            },
            {
                label: 'Qdrant Collection Cofiguration',
                name: 'qdrantCollectionConfiguration',
                type: 'json',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top K',
                name: 'topK',
                description: 'Number of top results to fetch. Default to 4',
                placeholder: '4',
                type: 'number',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Qdrant Search Filter',
                name: 'qdrantFilter',
                description: 'Only return points which satisfy the conditions',
                type: 'json',
                additionalParams: true,
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Qdrant Retriever',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Qdrant Vector Store',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(QdrantVectorStore)]
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const qdrantServerUrl = nodeData.inputs?.qdrantServerUrl as string
        const collectionName = nodeData.inputs?.qdrantCollection as string
        let qdrantCollectionConfiguration = nodeData.inputs?.qdrantCollectionConfiguration
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const output = nodeData.outputs?.output as string
        const topK = nodeData.inputs?.topK as string
        let queryFilter = nodeData.inputs?.queryFilter

        const k = topK ? parseFloat(topK) : 4

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const qdrantApiKey = getCredentialParam('qdrantApiKey', credentialData, nodeData)

        const client = new QdrantClient({
            url: qdrantServerUrl,
            apiKey: qdrantApiKey
        })

        const dbConfig: QdrantLibArgs = {
            client,
            collectionName
        }

        const retrieverConfig: RetrieverConfig = {
            k
        }

        if (qdrantCollectionConfiguration) {
            qdrantCollectionConfiguration =
                typeof qdrantCollectionConfiguration === 'object'
                    ? qdrantCollectionConfiguration
                    : JSON.parse(qdrantCollectionConfiguration)
            dbConfig.collectionConfig = qdrantCollectionConfiguration
        }

        if (queryFilter) {
            retrieverConfig.filter = typeof queryFilter === 'object' ? queryFilter : JSON.parse(queryFilter)
        }

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, dbConfig)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever(retrieverConfig)
            return retriever
        } else if (output === 'vectorStore') {
            ;(vectorStore as any).k = k
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Qdrant_Existing_VectorStores }
