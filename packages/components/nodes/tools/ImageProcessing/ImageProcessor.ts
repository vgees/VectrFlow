import { TImage } from 'bard-ai'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'

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
    outputs: { label: string; name: string; type: string }[]

    constructor() {
        this.label = 'Image Processor'
        this.name = 'imageProcessor'
        this.version = 1.0
        this.type = 'ImageDescription'
        this.icon = 'image.png'
        this.category = 'Tools'
        this.description = 'Processes images for its input'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: '__Secure-1PSID',
                name: 'secure1PSID',
                type: 'string'
            },
            {
                label: 'Image URL',
                name: 'imageUrl',
                type: 'string'
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<string> {
        const psid = nodeData.inputs?.secure1PSID as string
        const imageUrl = nodeData.inputs?.imageUrl as string

        try {
            // Dynamically import the bard-ai module
            const BardModule = await import('bard-ai')
            const Bard: typeof BardModule.default = BardModule.default // Access the default export

            const myBard = new Bard(psid)

            // Get the image description from Google Bard
            const result = await myBard.ask('Describe this image', { image: imageUrl as TImage })
            let description: string

            if (typeof result === 'string') {
                description = result
            } else if ('text' in result) {
                description = result.text as string // Add type assertion here
            } else {
                throw new Error('Unexpected response format from bard-ai.')
            }

            console.log(description)
            return description
        } catch (error) {
            console.error('Error processing the image with bard-ai:', error)
            return ''
        }
    }
}

module.exports = { nodeClass: ImageProcessor_Tools }
