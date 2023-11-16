import { ICommonObject, INode, INodeData, INodeParams, PromptTemplate } from '../../../src/Interface'
import { getBaseClasses, getInputVariables } from '../../../src/utils'
import { PromptTemplateInput } from 'langchain/prompts'
import imgbbUploader = require("imgbb-uploader")

class ImageLoader implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    color: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Image File'
        this.name = 'imageFile'
        this.version = 1.0
        this.type = 'PromptTemplate'
        this.icon = 'image.png'
        this.category = 'Document Loaders' 
        this.color = '#CC99FF'
        this.description = 'Load an image file (jpg, jpeg, or png)'
        this.baseClasses = [...getBaseClasses(PromptTemplate)]
        this.inputs = [
            {
                label: 'Image String',
                name: 'template',
                type: 'string'            
            },
            {
                label:'API Key',
                name: 'apikey',
                type: 'string'
            },
            {
                label: 'Image Upload Method',
                name: 'imageUploadMethod',
                type: 'options',
                description: 'Select a method to retrieve image',
                options: [
                    {
                        label: 'Local File',
                        name: 'imageFile',
                        description: 'Input path of image'
                    },
                    {
                        label: 'Image URL',
                        name: 'imageURL',
                        description: 'Input image URL'
                    }
                ],
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const template = nodeData.inputs?.template as string
        //const promptValuesStr = nodeData.inputs?.promptValues as string
        const imageUploadMethod = nodeData.inputs?.imageUploadMethod as string
        const apikey = nodeData.inputs?.apikey as string
        if(imageUploadMethod == 'imageFile')
        {
            imgbbUploader(apikey, template)
            .then((response: { url: any; }) => {
                //console.log(response.url); // This line is optional, you can remove it if you don't need to log the URL
                //template = response.url
                let promptValues: ICommonObject = {}
                /*if (promptValuesStr) {
                    promptValues = JSON.parse(promptValuesStr)
                }*/

                const inputVariables = getInputVariables(response.url)

                try {
                    const options: PromptTemplateInput = {
                        template,
                        inputVariables
                    }
                    const prompt = new PromptTemplate(options)
                    prompt.promptValues = promptValues
                    return prompt
                } catch (e) {
                    throw new Error(e)
        } // Return the URL instead of logging it
            })
            .catch((error: any) => console.error(error))
        }

        let promptValues: ICommonObject = {}
        /*if (promptValuesStr) {
            promptValues = JSON.parse(promptValuesStr)
        }*/

        const inputVariables = getInputVariables(template)

        try {
            const options: PromptTemplateInput = {
                template,
                inputVariables
            }
            const prompt = new PromptTemplate(options)
            prompt.promptValues = promptValues
            return prompt
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = { nodeClass: ImageLoader }
