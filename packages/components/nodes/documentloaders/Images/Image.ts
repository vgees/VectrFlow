import { INode, INodeData, INodeParams } from '../../../src/Interface';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import { python } from "pythonia";

class ImageLoader implements INode {
    label: string;
    name: string;
    version: number;
    description: string;
    type: string;
    icon: string;
    category: string;
    baseClasses: string[];
    inputs: INodeParams[];

    constructor() {
        this.label = 'Image File';
        this.name = 'imageFile';
        this.version = 1.0;
        this.type = 'Document';
        this.icon = 'image.png'; 
        this.category = 'Document Loaders';
        this.description = 'Load an image file (jpg, jpeg, or png)';
        this.baseClasses = [this.type];
        this.inputs = [
            {
                label: 'Image File',
                name: 'imageFile',
                type: 'file',
                fileType: '.jpg, .jpeg, .png'
            },
            // You can add additional parameters specific to image loading if needed
        ];
    }

    async init(nodeData: INodeData): Promise<any> {
        const imageFilePath = nodeData.inputs?.imageFile as string;

        // Create an instance of UnstructuredImageLoader
        // const loader = new UnstructuredLoader(imageFilePath);
        // Load the image using UnstructuredImageLoader
        // const imageData = await loader.load();

        async function fetchData(imageFilePath: string): Promise<any> {
            const rand = await python("./trial.py");
            return rand.image(imageFilePath);
        }

        const imageData = await fetchData(imageFilePath);
        console.log(imageData);

        return imageData;
    }
}

module.exports = { nodeClass: ImageLoader };