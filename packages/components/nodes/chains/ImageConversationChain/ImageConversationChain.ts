import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { RetrievalQAChain } from 'langchain/chains'
import { BaseRetriever } from 'langchain/schema/retriever'
import { getBaseClasses } from '../../../src/utils'
import { BaseLanguageModel } from 'langchain/base_language'
import { ConsoleCallbackHandler, CustomChainHandler, additionalCallbacks } from '../../../src/handler'

class ImageConversationChain_Chains implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Image Conversation Chain'
        this.name = 'imageConversationChain'
        this.version = 1.0
        this.type = 'ImageConversationChain'
        this.icon = 'image.png'
        this.category = 'Chains'
        this.description = 'QA chain to answer a question based on the retrieved images'
        this.baseClasses = [this.type, ...getBaseClasses(RetrievalQAChain)]
        this.inputs = [
            {
                label: 'Image',
                name: 'Image',
                type: 'Image'
            },
            {
                label: 'myBard',
                name: 'myBard',
                type: 'myBard'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const myBard = nodeData.inputs?.myBard
        const image = nodeData.inputs?.image as string

        //const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, { verbose: process.env.DEBUG === 'true' ? true : false })
        //return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const chain = nodeData.instance as RetrievalQAChain
        const myBard = nodeData.inputs?.myBard
        const image = nodeData.inputs?.image as string
        const obj = {
            query: input
        }
        const loggerHandler = new ConsoleCallbackHandler(options.logger)
        const callbacks = await additionalCallbacks(nodeData, options)

        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId)
            const res = await chain.call(obj, [loggerHandler, handler, ...callbacks])
            return (await myBard.ask(obj, {image: image}))
        } else {
            const res = await chain.call(obj, [loggerHandler, ...callbacks])
            return (await myBard.ask(obj, {image: image}))
        }
    }
}

module.exports = { nodeClass: ImageConversationChain_Chains }
