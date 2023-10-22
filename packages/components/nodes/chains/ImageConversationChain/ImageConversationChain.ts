import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface';
import { RetrievalQAChain } from 'langchain/chains';
import { getBaseClasses } from '../../../src/utils';
import { ConsoleCallbackHandler, additionalCallbacks } from '../../../src/handler';

class ImageConversationChain_Chains implements INode {
    label: string;
    name: string;
    version: number;
    type: string;
    icon: string;
    category: string;
    baseClasses: string[];
    description: string;
    inputs: INodeParams[];

    constructor() {
        this.label = 'Image Conversation Chain';
        this.name = 'imageConversationChain';
        this.version = 1.0;
        this.type = 'ImageConversationChain';
        this.icon = 'image.png';
        this.category = 'Chains';
        this.description = 'QA chain to answer a question based on the retrieved images';
        this.baseClasses = [this.type, ...getBaseClasses(RetrievalQAChain)];
        this.inputs = [
            {
                label: 'Image Description',
                name: 'imageDescription',
                type: 'description'
            }
        ];
    }

    async init(nodeData: INodeData): Promise<any> {
        // TODO: Here you can initialize any data you need
        // You had a commented-out RetrievalQAChain initialization, which can go here if needed
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const imageDescription = nodeData.inputs?.imageDescription as string;
        const loggerHandler = new ConsoleCallbackHandler(options.logger);
        const callbacks = await additionalCallbacks(nodeData, options);

        // TODO: Any logic or operations you want to do with the image description can go here
        // For now, it simply returns the description

        return imageDescription;
    }
}

module.exports = { nodeClass: ImageConversationChain_Chains };
