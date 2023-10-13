import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

class ImageProcessor_Tools implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'Image Proccessor'
        this.name = 'imageProcessor'
        this.version = 1.0
        this.type = 'myBard'
        this.icon = 'image.png'
        this.category = 'Tools'
        this.description = 'Proccesses images for its input'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '__Secure-1PSID',
                name: 'secure1PSID',
                type: 'string'
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {

        const psid = nodeData.inputs?.secure1PSID as string

        try {
            // Dynamically import the bard-ai module
            const BardModule = await import('bard-ai');
            const Bard: typeof BardModule.default = BardModule.default; // Access the default export
        
            // Assuming __Secure1PSID is a variable or a value you want to pass to the Bard constructor
            const myBard = new Bard(psid);
            return myBard
            console.log(myBard.ask("What is this image?",{image:"./image.png"}))
        } catch (error) {
            console.error('Error loading bard-ai module:', error);
        }
    }
}    

module.exports = { nodeClass: ImageProcessor_Tools }