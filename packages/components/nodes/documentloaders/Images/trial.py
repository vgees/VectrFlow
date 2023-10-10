import warnings
from pathlib import Path
from llama_index import download_loader

warnings.simplefilter('ignore')

def image(imageFilePath):

    ImageCaptionReader = download_loader("ImageCaptionReader")
    
    loader = ImageCaptionReader()
    documents = loader.load_data(file=Path(imageFilePath))
    pages = documents.text
    pages = pages.split()
    print(pages)