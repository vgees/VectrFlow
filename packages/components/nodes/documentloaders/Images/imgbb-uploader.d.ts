declare module 'imgbb-uploader' {
    function imgbbUploader(apiKey: string, filePath: string): Promise<{ url: string }>;
    export = imgbbUploader;
  }