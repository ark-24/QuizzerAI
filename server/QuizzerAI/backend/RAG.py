
import os
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain.vectorstores import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings  
from langchain_openai import ChatOpenAI  
from langchain.chains import RetrievalQA  
# from langchain_community.vectorstores import Pinecone
from langchain.chains import RetrievalQAWithSourcesChain 
import pinecone_datasets 

load_dotenv()
pinecone_api_key = os.environ.get('PINECONE_DB_API_KEY')
os.environ['PINECONE_API_KEY'] = pinecone_api_key
class RAGSystem:

    def __init__(self):
        self.pinecone_db = Pinecone(api_key=pinecone_api_key)
        self.pinecone_index = self.pinecone_db.Index("quizzerai") 
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key=os.environ.get('OPENAI_API_KEY')
        )
        self.llm = ChatOpenAI(  
        openai_api_key=os.environ.get('OPENAI_API_KEY'),
        model_name='gpt-3.5-turbo',  
        temperature=0.0  
        )  

    def generate_rag(self,content):
        if self.pinecone_db:
            self.pinecone_index = self.pinecone_db.Index("quizzerai") 
            while not self.pinecone_db.describe_index("quizzerai").status['ready']:
                time.sleep(1)
            
            query = (
                "Given the following data extracted from notes. "
                "Generate 10 true or false questions that can be used to study. "
                "Return the data in JSON with the question and answers with the '(correct)' around the right answer."
            )
#             dataset = pinecone_datasets.load_dataset(content)
#             dataset.documents.drop(dataset.documents.index[30_000:], inplace=True)
# # we drop sparse_values as they are not needed for this example  
#             dataset.documents.drop(['metadata'], axis=1, inplace=True)  
#             dataset.documents.rename(columns={'blob': 'metadata'}, inplace=True)  

            vectorstore = PineconeVectorStore.from_texts(  
                texts=self.split_document(content), embedding=self.embeddings,  index_name="quizzerai"
            )  
            print(self.pinecone_index.describe_index_stats())

            qa = RetrievalQA.from_chain_type(  
                llm=self.llm,  
                chain_type="stuff",  
                retriever=vectorstore.as_retriever()  
            )
            return qa.invoke(query) 

    def split_document(self, doc):
        text_splitter =  RecursiveCharacterTextSplitter(
            chunk_size = 800,
            chunk_overlap = 80,
            # length_function=len,
            # is_separator_regex=False
        )
        return text_splitter.split_text(doc)

            


            
        

