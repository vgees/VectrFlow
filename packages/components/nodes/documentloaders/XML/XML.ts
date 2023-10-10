import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
//import { test } from 'linkifyjs'
//import { webCrawl, xmlScrape } from '../../../src'
//import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import axios from 'axios';
import * as xml2js from 'xml2js';
//import htmlToText from 'html-to-text';
const {default : htmlToText} = require('html-to-text');

class XMLLoader implements INode {
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
        this.label = 'XML File';
        this.name = 'xmlFile';
        this.version = 1.0;
        this.type = 'Document';
        this.icon = 'XML.jpg'; 
        this.category = 'Document Loaders';
        this.description = 'Load a xml url';
        this.baseClasses = [this.type];
        this.inputs = [
            {
                label: 'XML Link',
                name: 'xmlLink',
                type: 'string',
                placeholder: 'https://github.com/FlowiseAI/Flowise'
            },
            {
                label: 'Text Splitter',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            }
            // You can add additional parameters specific to image loading if needed
        ];
    }

    async init(nodeData: INodeData): Promise<any> {
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const metadata = nodeData.inputs?.metadata
        const xmlUrl: string = nodeData.inputs?.xmlLink;
        /*xmlUrl = xmlUrl.trim()
        if (!test(xmlUrl)) {
            throw new Error('Invalid URL')
        }*/
        //let limit = nodeData.inputs?.limit as string
        async function fetchDataFromXMLUrl(url: string): Promise<string[]> {
            try {
              const response = await axios.get(url);
              const xmlData = response.data;
              //console.log(xmlData)
              const parser = new xml2js.Parser({ explicitArray: false });
              //console.log(parser)
              const parsedData = await parser.parseStringPromise(xmlData);
              //console.log(parsedData)
              //typeof(parsedData)
              //console.log(parsedData.urlset.url());
              const test = parsedData['urlset']['url'];
              //return test;
              const extractedContent = parsedData.urlset.url.map((url: any) => url.loc);
              return extractedContent;
            } catch (error) {
              throw new Error(`Error fetching or parsing XML data: ${error.message}`);
            }
          }
        console.log(xmlUrl);
        console.log(nodeData.inputs);
        const extractedContent = await fetchDataFromXMLUrl(xmlUrl);
    //console.log('Extracted Content:', extractedContent);
    //console.log(typeof(extractedContent))

        let urls = Object.values(extractedContent);
    //console.log(urls[0])
        const responseDataArray = [];
        for (const url in urls) {
      //console.log(urls[url])
            const response = await axios.get(url);
            responseDataArray.push(response.data);
      //console.log('Data from', url, ':', response.data);
            const text = htmlToText(response.data)
    }
}
    
 /*       interface Url {
            loc: string;
        }

        interface Urlset {
            url: Url[];
        }

        interface ParsedData {
            urlset: Urlset;
        }

        async function fetchDataFromXMLUrl(url: string): Promise<string[]> {
        try {
            const response = await axios.get(url);
            const xmlData = response.data;
            const parser = new xml2js.Parser({ explicitArray: false });
            const parsedData: ParsedData = await parser.parseStringPromise(xmlData);
            const extractedContent: string[] = parsedData.urlset.url.map((url: Url) => url.loc);
            return extractedContent;
        } catch (error) {
            throw new Error(`Error fetching or parsing XML data: ${error.message}`);
        }
    }

    try {
         // Replace this with the actual XML URL
        const extractedContent: string[] = await fetchDataFromXMLUrl(xmlUrl);
        const responseDataArray: any[] = [];

        for (const url of extractedContent) {
            const response = await axios.get(url);
            responseDataArray.push(response.data);
            const text: string = htmlToText(response.data);
            return text
        }
    } catch (error) {
        console.error(error.message);
    }
}*/
}

module.exports = { nodeClass: XMLLoader };
